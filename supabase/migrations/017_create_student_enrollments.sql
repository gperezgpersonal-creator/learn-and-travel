-- Create student_enrollments table
create table if not exists student_enrollments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id) on delete cascade not null,
  program_id text not null, -- Intentionally text to match program IDs like '84-ORL2026'
  status text default 'enrolled', -- enrolled, cancelled, completed
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(student_id, program_id)
);

-- Enable RLS
alter table student_enrollments enable row level security;

-- Policies
create policy "Enable read access for authenticated users"
  on student_enrollments for select
  to authenticated
  using (true);

create policy "Enable insert access for authenticated users"
  on student_enrollments for insert
  to authenticated
  with check (true);

create policy "Enable update access for authenticated users"
  on student_enrollments for update
  to authenticated
  using (true);

create policy "Enable delete access for authenticated users"
  on student_enrollments for delete
  to authenticated
  using (true);

-- Add indexes
create index if not exists idx_student_enrollments_student_id on student_enrollments(student_id);
create index if not exists idx_student_enrollments_program_id on student_enrollments(program_id);
