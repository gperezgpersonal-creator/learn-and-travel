-- Create the logos table
create table public.logos (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.logos enable row level security;

-- Create policy to allow read access for everyone (public)
create policy "Allow public read access"
  on public.logos for select
  using (true);

-- Create policy to allow insert/update/delete for authenticated users only
create policy "Allow authenticated insert"
  on public.logos for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update"
  on public.logos for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete"
  on public.logos for delete
  using (auth.role() = 'authenticated');

-- Seed the table with existing logos
insert into public.logos (label, url) values 
  ('Netflix', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'),
  ('Sony Pictures', 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Sony_Pictures_logo.svg'),
  ('Activision', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Activision_Blizzard_logo.svg'),
  ('Epic Games', 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg'),
  ('Live Nation', 'https://upload.wikimedia.org/wikipedia/en/e/ed/Live_Nation_Entertainment_logo.svg'),
  ('Universal Music', 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Universal_Music_Group_logo.svg'),
  ('ESPN', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/ESPN_wordmark.svg'),
  ('Spotify', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'),
  ('Tec de Monterrey', '/tec-monterrey-white.png'),
  ('PrepaTec', '/images/prepatec-logo-white.png'),
  ('Learn & Travel', 'https://learnandtravel.com/logo.png');
