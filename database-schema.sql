-- SQL Schema for Contact Forms and Leads Tables
-- Run this in your Supabase SQL Editor

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_forms table
CREATE TABLE IF NOT EXISTS contact_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON contact_forms(status);
CREATE INDEX IF NOT EXISTS idx_contact_forms_created_at ON contact_forms(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_forms_email ON contact_forms(email);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
-- Allow anyone to insert (for contact form submissions)
CREATE POLICY "Allow public insert on leads" ON leads
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow authenticated users to view all leads
CREATE POLICY "Allow authenticated users to view leads" ON leads
    FOR SELECT TO authenticated
    USING (true);

-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated users to update leads" ON leads
    FOR UPDATE TO authenticated
    USING (true);

-- Create policies for contact_forms table
-- Allow anyone to insert (for contact form submissions)
CREATE POLICY "Allow public insert on contact_forms" ON contact_forms
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow public read access for API (this allows the API to fetch data)
CREATE POLICY "Allow public read on contact_forms" ON contact_forms
    FOR SELECT TO anon
    USING (true);

-- Allow authenticated users to view all contact forms
CREATE POLICY "Allow authenticated users to view contact_forms" ON contact_forms
    FOR SELECT TO authenticated
    USING (true);

-- Allow authenticated users to update contact forms (for status changes)
CREATE POLICY "Allow authenticated users to update contact_forms" ON contact_forms
    FOR UPDATE TO authenticated
    USING (true);

-- Grant necessary permissions
GRANT INSERT ON leads TO anon;
GRANT INSERT ON contact_forms TO anon;
GRANT ALL ON leads TO authenticated;
GRANT ALL ON contact_forms TO authenticated;