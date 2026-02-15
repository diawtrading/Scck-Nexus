#!/usr/bin/env python3
import os
import sys
from datetime import datetime
import argparse

ROOT = os.path.abspath(os.getcwd())


def path_exists(p: str) -> bool:
    return os.path.exists(p)


def find_one(paths):
    for p in paths:
        if p and path_exists(p):
            return p
    return None


def scan(root: str) -> dict:
    checks = {}

    # CI configuration presence (any common CI)
    ci_paths = [
        os.path.join(root, '.github', 'workflows'),
        os.path.join(root, '.circleci'),
        os.path.join(root, 'azure-pipelines.yml'),
        os.path.join(root, 'gitlab-ci.yml'),
        os.path.join(root, 'pipeline.yml'),
    ]
    checks['ci_config'] = bool(find_one(ci_paths))

    # Release notes presence
    checks['release_notes'] = any([
        path_exists(os.path.join(root, 'CHANGELOG.md')),
        path_exists(os.path.join(root, 'RELEASE_NOTES.md')),
        path_exists(os.path.join(root, 'RELEASE.md')),
        path_exists(os.path.join(root, 'RELEASE_NOTES.txt')),
    ])

    # Tests presence (directories or common test scripts)
    tests_dirs = [
        os.path.join(root, 'tests'),
        os.path.join(root, 'test'),
        os.path.join(root, 'src', 'tests'),
    ]
    tests_scripts = False
    if path_exists(os.path.join(root, 'package.json')):
        try:
            import json
            with open(os.path.join(root, 'package.json'), 'r', encoding='utf-8') as f:
                pkg = json.load(f)
            if isinstance(pkg, dict) and 'scripts' in pkg and isinstance(pkg['scripts'], dict) and 'test' in pkg['scripts']:
                tests_scripts = True
        except Exception:
            pass
    if path_exists(os.path.join(root, 'requirements.txt')) or path_exists(os.path.join(root, 'pyproject.toml')):
        tests_scripts = True
    checks['tests_present'] = any(path_exists(d) for d in tests_dirs) or tests_scripts

    # Lint/config presence
    lint_candidates = [
        os.path.join(root, '.flake8'),
        os.path.join(root, '.eslintignore'),
        os.path.join(root, '.eslintrc.json'),
        os.path.join(root, 'lint.config.js'),
        os.path.join(root, 'tox.ini'),
        os.path.join(root, 'golangci.yml'),
    ]
    checks['lint_config'] = any(path_exists(p) for p in lint_candidates)

    # Docker-related files
    checks['dockerfile'] = path_exists(os.path.join(root, 'Dockerfile')) or path_exists(os.path.join(root, 'docker-compose.yml'))

    # Infrastructure as code presence
    checks['terraform'] = path_exists(os.path.join(root, 'infra')) or path_exists(os.path.join(root, 'terraform'))
    checks['k8s'] = path_exists(os.path.join(root, 'k8s')) or path_exists(os.path.join(root, 'manifests')) or path_exists(os.path.join(root, 'deployment.yaml'))
    checks['db_migrations'] = (
        path_exists(os.path.join(root, 'migrations'))
        or path_exists(os.path.join(root, 'db', 'migrate'))
        or path_exists(os.path.join(root, 'database', 'migrations'))
    )

    # Weighted score
    weights = {
        'ci_config': 15,
        'release_notes': 5,
        'tests_present': 25,
        'lint_config': 5,
        'dockerfile': 10,
        'terraform': 5,
        'k8s': 5,
        'db_migrations': 5,
    }
    score = 0
    for k, w in weights.items():
        if checks.get(k):
            score += w
    checks['score'] = score
    return checks


def render_report(root: str, checks: dict, report_path: str) -> str:
    date_str = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    lines = []
    lines.append("# Deployment Readiness Report")
    lines.append("")
    lines.append(f"Date: {date_str}")
    lines.append(f"Project root: {root}")
    lines.append(f"Score: {checks.get('score', 0)}/100")
    lines.append("")
    lines.append("Checklist:")
    for k in ['ci_config','release_notes','tests_present','lint_config','dockerfile','terraform','k8s','db_migrations']:
        v = checks.get(k, False)
        name = k.replace('_', ' ').title()
        lines.append(f"- {name}: {'Present' if v else 'Missing'}")
    lines.append("")
    lines.append("Evidence:")
    if checks.get('ci_config'):
        lines.append("  - CI config detected")
    if checks.get('release_notes'):
        lines.append("  - Release notes file detected")
    if checks.get('tests_present'):
        lines.append("  - Tests found (unit/integration/ETL- or similar)")
    if checks.get('lint_config'):
        lines.append("  - Lint/static analysis config detected")
    if checks.get('dockerfile'):
        lines.append("  - Dockerfile or docker-compose present")
    if checks.get('terraform'):
        lines.append("  - Terraform IaC detected")
    if checks.get('k8s'):
        lines.append("  - Kubernetes manifests detected (k8s/manifests/deployments)")
    if checks.get('db_migrations'):
        lines.append("  - DB migrations detected")

    lines.append("")
    lines.append("Notes:")
    lines.append("  - This report is auto-generated and may be updated as the repo evolves.")
    content = "\n".join(lines) + "\n"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return content


def main():
    parser = argparse.ArgumentParser(description="Deployment Readiness Reporter (auto-generated).")
    parser.add_argument('--root', default='.', help='Project root (default: current dir)')
    parser.add_argument('--out', default='deployment_readiness_report.md', help='Output report path')
    args = parser.parse_args()

    root = os.path.abspath(args.root)
    checks = scan(root)
    render_report(root, checks, os.path.abspath(args.out))
    print("Deployment Readiness Report generated at:", os.path.abspath(args.out))
    print("Score:", checks.get('score', '0'), '/100')
    summary_items = [
        ('CI config', checks.get('ci_config')),
        ('Release notes', checks.get('release_notes')),
        ('Tests present', checks.get('tests_present')),
        ('Lint config', checks.get('lint_config')),
        ('Dockerfile', checks.get('dockerfile')),
        ('Terraform IaC', checks.get('terraform')),
        ('K8s manifests', checks.get('k8s')),
        ('DB migrations', checks.get('db_migrations')),
    ]
    for name, ok in summary_items:
        print(f"- {name}: {'Present' if ok else 'Missing'}")

if __name__ == '__main__':
    main()
