-- =====================================================
-- SCCK ERP NEXUS - SUPABASE DATABASE SCHEMA
-- =====================================================
-- This schema includes all tables for the ERP system
-- Run this in Supabase SQL Editor to set up the database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('Admin', 'CEO', 'CFO', 'COO', 'Manager', 'Employee');
CREATE TYPE producer_statut AS ENUM ('Active', 'Inactive', 'Suspended');
CREATE TYPE collection_statut AS ENUM ('Recorded', 'Validated', 'Paid');
CREATE TYPE inventory_statut AS ENUM ('In Stock', 'Low Stock', 'Out of Stock', 'Discontinued');
CREATE TYPE employee_statut AS ENUM ('Active', 'Inactive', 'On Leave', 'Terminated');
CREATE TYPE customer_statut AS ENUM ('Active', 'Inactive', 'Prospect');
CREATE TYPE supplier_statut AS ENUM ('Active', 'Inactive', 'Suspended');
CREATE TYPE project_statut AS ENUM ('Planned', 'In Progress', 'Completed', 'Cancelled');
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE contract_type AS ENUM ('Full-time', 'Part-time', 'Contract', 'Intern');
CREATE TYPE quality_grade AS ENUM ('Grade A', 'Grade B', 'Grade C', 'Premium');

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role user_role DEFAULT 'Employee',
    department TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_department ON public.users(department);

-- =====================================================
-- PRODUCERS TABLE (Cocoa Farmers)
-- =====================================================

CREATE TABLE public.producers (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    zone TEXT NOT NULL,
    superficie DECIMAL(10,2),
    statut producer_statut DEFAULT 'Active',
    telephone TEXT,
    email TEXT,
    adresse TEXT,
    date_inscription TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_producers_zone ON public.producers(zone);
CREATE INDEX idx_producers_statut ON public.producers(statut);
CREATE INDEX idx_producers_name ON public.producers(nom);

-- =====================================================
-- COLLECTIONS TABLE (Cocoa Collections)
-- =====================================================

CREATE TABLE public.collections (
    id TEXT PRIMARY KEY,
    producer_id TEXT NOT NULL REFERENCES public.producers(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    quantite DECIMAL(10,2) NOT NULL,
    qualite quality_grade,
    prix_unitaire DECIMAL(10,2),
    total DECIMAL(12,2),
    statut collection_statut DEFAULT 'Recorded',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_collections_producer ON public.collections(producer_id);
CREATE INDEX idx_collections_date ON public.collections(date);
CREATE INDEX idx_collections_statut ON public.collections(statut);
CREATE INDEX idx_collections_quality ON public.collections(qualite);

-- =====================================================
-- TRANSACTIONS TABLE (Finance)
-- =====================================================

CREATE TABLE public.transactions (
    id TEXT PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL,
    compte TEXT,
    description TEXT NOT NULL,
    debit DECIMAL(12,2) DEFAULT 0,
    credit DECIMAL(12,2) DEFAULT 0,
    balance DECIMAL(12,2),
    type transaction_type,
    reference_id TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_compte ON public.transactions(compte);
CREATE INDEX idx_transactions_user ON public.transactions(user_id);

-- =====================================================
-- INVENTORY TABLE
-- =====================================================

CREATE TABLE public.inventory (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    quantite DECIMAL(10,2) NOT NULL,
    unite TEXT,
    valeur DECIMAL(12,2),
    min_stock DECIMAL(10,2),
    max_stock DECIMAL(10,2),
    localisation TEXT,
    statut inventory_statut DEFAULT 'In Stock',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_inventory_nom ON public.inventory(nom);
CREATE INDEX idx_inventory_statut ON public.inventory(statut);
CREATE INDEX idx_inventory_localisation ON public.inventory(localisation);

-- =====================================================
-- EMPLOYEES TABLE
-- =====================================================

CREATE TABLE public.employees (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    poste TEXT NOT NULL,
    departement TEXT NOT NULL,
    contrat contract_type,
    salaire DECIMAL(12,2),
    date_embauche DATE,
    employee_statut employee_statut DEFAULT 'Active',
    telephone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_employees_nom ON public.employees(nom);
CREATE INDEX idx_employees_departement ON public.employees(departement);
CREATE INDEX idx_employees_poste ON public.employees(poste);
CREATE INDEX idx_employees_statut ON public.employees(employee_statut);

-- =====================================================
-- CUSTOMERS TABLE
-- =====================================================

CREATE TABLE public.customers (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    contact TEXT,
    telephone TEXT,
    email TEXT,
    adresse TEXT,
    ca DECIMAL(12,2) DEFAULT 0,
    pays TEXT,
    statut customer_statut DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_customers_nom ON public.customers(nom);
CREATE INDEX idx_customers_pays ON public.customers(pays);
CREATE INDEX idx_customers_statut ON public.customers(statut);

-- =====================================================
-- SUPPLIERS TABLE
-- =====================================================

CREATE TABLE public.suppliers (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    contact TEXT,
    telephone TEXT,
    email TEXT,
    specialite TEXT,
    paiement TEXT,
    adresse TEXT,
    statut supplier_statut DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_suppliers_nom ON public.suppliers(nom);
CREATE INDEX idx_suppliers_specialite ON public.suppliers(specialite);
CREATE INDEX idx_suppliers_statut ON public.suppliers(statut);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================

CREATE TABLE public.projects (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    budget DECIMAL(12,2),
    depense DECIMAL(12,2) DEFAULT 0,
    progression DECIMAL(5,2) DEFAULT 0,
    statut project_statut DEFAULT 'Planned',
    date_debut DATE,
    date_fin DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_nom ON public.projects(nom);
CREATE INDEX idx_projects_statut ON public.projects(statut);
CREATE INDEX idx_projects_dates ON public.projects(date_debut, date_fin);

-- =====================================================
-- PROJECT ASSIGNMENTS (Many-to-Many: Employees <-> Projects)
-- =====================================================

CREATE TABLE public.project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    role TEXT,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, employee_id)
);

CREATE INDEX idx_project_assignments_project ON public.project_assignments(project_id);
CREATE INDEX idx_project_assignments_employee ON public.project_assignments(employee_id);

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR USERS
-- =====================================================

-- Users can read all users
CREATE POLICY "Users can view all users"
ON public.users FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert users
CREATE POLICY "Admins can insert users"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- Only admins can update users
CREATE POLICY "Admins can update users"
ON public.users FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- =====================================================
-- RLS POLICIES FOR PRODUCERS
-- =====================================================

-- All authenticated users can view producers
CREATE POLICY "Authenticated users can view producers"
ON public.producers FOR SELECT
TO authenticated
USING (true);

-- Managers and above can insert producers
CREATE POLICY "Managers can insert producers"
ON public.producers FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Managers and above can update producers
CREATE POLICY "Managers can update producers"
ON public.producers FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Only admins can delete producers
CREATE POLICY "Admins can delete producers"
ON public.producers FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- =====================================================
-- RLS POLICIES FOR COLLECTIONS
-- =====================================================

-- All authenticated users can view collections
CREATE POLICY "Authenticated users can view collections"
ON public.collections FOR SELECT
TO authenticated
USING (true);

-- Managers and above can insert collections
CREATE POLICY "Managers can insert collections"
ON public.collections FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Managers and above can update collections
CREATE POLICY "Managers can update collections"
ON public.collections FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Only admins can delete collections
CREATE POLICY "Admins can delete collections"
ON public.collections FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- =====================================================
-- RLS POLICIES FOR TRANSACTIONS
-- =====================================================

-- All authenticated users can view transactions
CREATE POLICY "Authenticated users can view transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (true);

-- Only Finance roles can insert transactions
CREATE POLICY "Finance can insert transactions"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'CFO')
    )
);

-- Only Finance roles can update transactions
CREATE POLICY "Finance can update transactions"
ON public.transactions FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'CFO')
    )
);

-- Only admins can delete transactions
CREATE POLICY "Admins can delete transactions"
ON public.transactions FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- =====================================================
-- RLS POLICIES FOR INVENTORY
-- =====================================================

-- All authenticated users can view inventory
CREATE POLICY "Authenticated users can view inventory"
ON public.inventory FOR SELECT
TO authenticated
USING (true);

-- Managers can insert inventory
CREATE POLICY "Managers can insert inventory"
ON public.inventory FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Managers can update inventory
CREATE POLICY "Managers can update inventory"
ON public.inventory FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Only admins can delete inventory
CREATE POLICY "Admins can delete inventory"
ON public.inventory FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- =====================================================
-- RLS POLICIES FOR EMPLOYEES
-- =====================================================

-- All authenticated users can view employees
CREATE POLICY "Authenticated users can view employees"
ON public.employees FOR SELECT
TO authenticated
USING (true);

-- Only HR/Admin can insert employees
CREATE POLICY "HR can insert employees"
ON public.employees FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO')
    )
);

-- Only HR/Admin can update employees
CREATE POLICY "HR can update employees"
ON public.employees FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO')
    )
);

-- Only admins can delete employees
CREATE POLICY "Admins can delete employees"
ON public.employees FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- =====================================================
-- RLS POLICIES FOR CUSTOMERS
-- =====================================================

-- All authenticated users can view customers
CREATE POLICY "Authenticated users can view customers"
ON public.customers FOR SELECT
TO authenticated
USING (true);

-- Managers can insert customers
CREATE POLICY "Managers can insert customers"
ON public.customers FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Managers can update customers
CREATE POLICY "Managers can update customers"
ON public.customers FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Only admins can delete customers
CREATE POLICY "Admins can delete customers"
ON public.customers FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- =====================================================
-- RLS POLICIES FOR SUPPLIERS
-- =====================================================

-- All authenticated users can view suppliers
CREATE POLICY "Authenticated users can view suppliers"
ON public.suppliers FOR SELECT
TO authenticated
USING (true);

-- Managers can insert suppliers
CREATE POLICY "Managers can insert suppliers"
ON public.suppliers FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Managers can update suppliers
CREATE POLICY "Managers can update suppliers"
ON public.suppliers FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Only admins can delete suppliers
CREATE POLICY "Admins can delete suppliers"
ON public.suppliers FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- =====================================================
-- RLS POLICIES FOR PROJECTS
-- =====================================================

-- All authenticated users can view projects
CREATE POLICY "Authenticated users can view projects"
ON public.projects FOR SELECT
TO authenticated
USING (true);

-- Managers can insert projects
CREATE POLICY "Managers can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Managers can update projects
CREATE POLICY "Managers can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- Only admins can delete projects
CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- =====================================================
-- RLS POLICIES FOR PROJECT ASSIGNMENTS
-- =====================================================

CREATE POLICY "Authenticated can view assignments"
ON public.project_assignments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Managers can manage assignments"
ON public.project_assignments FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('Admin', 'CEO', 'COO', 'Manager')
    )
);

-- =====================================================
-- RLS POLICIES FOR AUDIT LOGS
-- =====================================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'Admin'
    )
);

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS: Auto-update updated_at
-- =====================================================

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_producers_updated_at
    BEFORE UPDATE ON public.producers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Audit log trigger
-- =====================================================

CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
        VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
        VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD), to_jsonb(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data)
        VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STORAGE: Bucket for file uploads
-- =====================================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_extensions)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['jpg', 'jpeg', 'png', 'gif', 'webp'])
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_extensions)
VALUES ('documents', 'documents', true, 104857600, ARRAY['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Avatar upload policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Avatar public read policy"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Documents upload policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Documents public read policy"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- =====================================================
-- SEED DATA: Default admin user
-- =====================================================

-- Note: Password should be hashed with bcrypt
-- Default admin user: admin@scck.com / admin123
INSERT INTO public.users (email, password, name, role, department)
VALUES ('admin@scck.com', '$2a$10$rQZ8K8Y8Y8Y8Y8Y8Y8Y8YO8K8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8', 'Admin User', 'Admin', 'Administration')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- VIEWS: Common queries
-- =====================================================

-- Dashboard KPIs View
CREATE OR REPLACE VIEW public.v_dashboard_kpis AS
SELECT 
    (SELECT COUNT(*) FROM public.producers WHERE statut = 'Active') as active_producers,
    (SELECT COALESCE(SUM(quantite), 0) FROM public.collections) as tons_collected,
    (SELECT COALESCE(SUM(total), 0) FROM public.collections) as total_revenue,
    (SELECT COALESCE(SUM(credit), 0) FROM public.transactions) as total_income,
    (SELECT COALESCE(SUM(debit), 0) FROM public.transactions) as total_expense,
    (SELECT COUNT(*) FROM public.employees WHERE employee_statut = 'Active') as active_employees,
    (SELECT COUNT(*) FROM public.customers WHERE statut = 'Active') as active_customers,
    (SELECT COUNT(*) FROM public.projects WHERE statut = 'In Progress') as active_projects;

-- Zone Performance View
CREATE OR REPLACE VIEW public.v_zone_performance AS
SELECT 
    p.zone,
    COUNT(DISTINCT p.id) as producer_count,
    COUNT(c.id) as collection_count,
    COALESCE(SUM(c.quantite), 0) as total_quantity,
    COALESCE(SUM(c.total), 0) as total_revenue
FROM public.producers p
LEFT JOIN public.collections c ON p.id = c.producer_id
GROUP BY p.zone;

-- Employee Payroll View
CREATE OR REPLACE VIEW public.v_payroll_summary AS
SELECT 
    departement,
    COUNT(*) as employee_count,
    COALESCE(SUM(salaire), 0) as total_payroll,
    COALESCE(AVG(salaire), 0) as average_salary,
    COUNT(CASE WHEN contrat = 'Full-time' THEN 1 END) as full_time_count,
    COUNT(CASE WHEN contrat = 'Part-time' THEN 1 END) as part_time_count
FROM public.employees
WHERE employee_statut = 'Active'
GROUP BY departement;

-- =====================================================
-- COMPLETE!
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'SCCK ERP NEXUS database schema created successfully!';
END $$;
