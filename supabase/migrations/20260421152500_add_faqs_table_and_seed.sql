create table if not exists public.faqs (
  id uuid primary key default extensions.uuid_generate_v4(),
  question_bm text not null,
  answer_bm text not null,
  question_en text not null,
  answer_en text not null,
  sort_order integer not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.faqs enable row level security;

drop policy if exists "Public can view FAQs" on public.faqs;
create policy "Public can view FAQs"
  on public.faqs for select
  using (true);

drop policy if exists "App can manage FAQs" on public.faqs;
create policy "App can manage FAQs"
  on public.faqs for all
  using (true)
  with check (true);

drop trigger if exists update_faqs_updated_at on public.faqs;
create trigger update_faqs_updated_at
before update on public.faqs
for each row
execute function public.update_updated_at_column();

insert into public.faqs (question_bm, answer_bm, question_en, answer_en, sort_order)
values
  (
    'Apakah EZ Meta dan siapa yang sesuai guna?',
    'EZ Meta ialah platform optimasi Meta Ads berasaskan data dan AI. Ia sesuai untuk usahawan, marketer, SME, dan agensi yang mahu keputusan lebih pantas.',
    'What is EZ Meta and who is it for?',
    'EZ Meta is a data- and AI-driven Meta Ads optimization platform built for entrepreneurs, marketers, SMEs, and agencies that need faster decisions.',
    1
  ),
  (
    'Adakah data akaun iklan saya selamat?',
    'Ya. EZ Meta hanya menggunakan akses yang diperlukan untuk analisis prestasi dan cadangan optimasi. Anda boleh cabut akses pada bila-bila masa.',
    'Is my ad account data secure?',
    'Yes. EZ Meta only uses the access required for performance analysis and optimization recommendations. You can revoke access at any time.',
    2
  ),
  (
    'Bagaimana struktur harga EZ Meta?',
    'Harga disusun kepada Starter, Pro, dan Agency. Pelan lebih tinggi mewarisi ciri pelan lebih rendah serta menambah ciri lanjutan.',
    'How is EZ Meta pricing structured?',
    'Pricing is structured as Starter, Pro, and Agency. Higher plans inherit lower-plan features and add advanced capabilities.',
    3
  ),
  (
    'Bolehkah saya naik taraf atau turun taraf pelan?',
    'Boleh. Anda boleh ubah pelan mengikut keperluan semasa. Perubahan akan tertakluk kepada polisi bil kitaran aktif.',
    'Can I upgrade or downgrade my plan?',
    'Yes. You can change plans based on your current needs, subject to your active billing cycle policy.',
    4
  ),
  (
    'Apakah maksud AI Recommendations?',
    'AI Recommendations memberi cadangan tindakan berdasarkan metrik kempen seperti CTR, CPC, ROAS, fatigue creative, dan trend bajet.',
    'What are AI Recommendations?',
    'AI Recommendations provide action suggestions based on campaign metrics such as CTR, CPC, ROAS, creative fatigue, and budget trends.',
    5
  ),
  (
    'Adakah EZ Meta menyokong operasi multi-client untuk agensi?',
    'Ya. Pelan Agency menyokong pengurusan multi-client, pemantauan berpusat, dan aliran kerja yang lebih skalabel.',
    'Does EZ Meta support multi-client operations for agencies?',
    'Yes. The Agency plan supports multi-client management, centralized monitoring, and more scalable workflows.',
    6
  ),
  (
    'Bagaimana cara mendapatkan sokongan teknikal?',
    'Anda boleh hubungi sokongan melalui saluran dalam platform. Pelan Agency menerima keutamaan respons yang lebih tinggi.',
    'How can I get technical support?',
    'You can contact support through channels inside the platform. Agency plans receive higher response priority.',
    7
  ),
  (
    'Adakah saya perlukan setup teknikal yang kompleks?',
    'Tidak. Setup asas adalah ringkas: sambungkan akaun, semak dashboard, dan ikuti cadangan optimasi yang dijana.',
    'Do I need a complex technical setup?',
    'No. Initial setup is simple: connect your account, review the dashboard, and apply generated optimization suggestions.',
    8
  ),
  (
    'Bagaimana EZ Meta membantu tingkatkan ROI?',
    'EZ Meta membantu mengenal pasti iklan kurang perform, mengurangkan pembaziran bajet, dan memfokuskan usaha pada kempen yang lebih berpotensi.',
    'How does EZ Meta help improve ROI?',
    'EZ Meta helps identify underperforming ads, reduce budget waste, and focus effort on higher-potential campaigns.',
    9
  ),
  (
    'Adakah platform menyokong BM dan EN?',
    'Ya. Platform menyokong kandungan dwibahasa BM/EN termasuk tetapan CMS untuk headline, pricing, benefits, dan FAQ.',
    'Does the platform support BM and EN?',
    'Yes. The platform supports BM/EN bilingual content including CMS settings for headlines, pricing, benefits, and FAQs.',
    10
  )
on conflict do nothing;

