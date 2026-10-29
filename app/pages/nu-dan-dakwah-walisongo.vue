<template>
  <main class="article-page">
    <section class="article-hero">
      <img :src="walisongoImage" alt="Ilustrasi siluet Wali Songo dengan wayang, Menara Kudus, candi, gapura, makam wali, gamelan, dan peta Jawa" />
      <div class="article-hero__overlay"></div>
      <div class="article-hero__content">
        <NuxtLink to="/sejarah-nu" class="article-back">← Sejarah NU</NuxtLink>
        <p class="eyebrow">EDITORIAL SEJARAH NU <span></span> 06 / 2027</p>
        <h1>NU Melanjutkan Dakwah Wali Songo</h1>
        <p class="article-summary">Merawat tradisi Aswaja, pesantren, kebudayaan, dan persatuan umat di Nusantara.</p>
        <div class="article-meta"><span>Harlah NU ke-101</span><span>•</span><span>Bacaan 5 menit</span></div>
      </div>
    </section>

    <article class="article-content">
      <div class="article-content__ornament" aria-hidden="true">✦</div>
      <p class="article-lead">Nahdlatul Ulama menempatkan Wali Songo sebagai salah satu teladan utama dalam memahami perjalanan dakwah Islam di Nusantara. Bagi NU, dakwah bukan sekadar menyampaikan pengetahuan agama, melainkan juga membangun peradaban, merawat persaudaraan, dan menghadirkan kemaslahatan bagi masyarakat.</p>

      <h2>Melanjutkan mata rantai ulama Aswaja</h2>
      <p>Wali Songo hadir dalam ingatan sejarah sebagai ulama yang mengembangkan Islam melalui pendidikan, keteladanan, perdagangan, kesenian, dan hubungan sosial. Mereka membangun ruang perjumpaan antara ajaran Islam dan kebudayaan setempat tanpa kehilangan prinsip keagamaan.</p>
      <p>NU memandang kelahirannya sebagai kelanjutan dari mata rantai perjuangan ulama Ahlussunnah wal Jama'ah di Nusantara. Ketika tantangan zaman berubah, bentuk gerakan pun berkembang: jaringan pesantren dan dakwah ulama kemudian diperkuat melalui organisasi yang mampu menjawab persoalan sosial, kebangsaan, dan keagamaan secara lebih teratur.</p>

      <h2>Dakwah yang membumi dan mempersatukan</h2>
      <p>Warisan Wali Songo mengajarkan pentingnya dakwah yang bijaksana, santun, dan dekat dengan kehidupan masyarakat. Wayang, gamelan, arsitektur, bahasa, tradisi keilmuan, dan ruang-ruang kebudayaan dapat menjadi media untuk menyampaikan nilai Islam selama digunakan dengan tanggung jawab dan tidak bertentangan dengan prinsip syariat.</p>
      <p>Semangat tersebut sejalan dengan karakter dakwah NU: merangkul, membina, dan menguatkan persaudaraan. Pesantren menjadi ruang penting untuk meneruskan tradisi ilmu, akhlak, dan kaderisasi, sementara organisasi menjadi sarana untuk menghidupkan khidmah dalam skala masyarakat dan kebangsaan.</p>

      <h2>Dari jejak sejarah menuju khidmah masa kini</h2>
      <p>Meneladani Wali Songo bukan berarti mengulang cara lama secara harfiah. Yang diwarisi adalah hikmah dan prinsipnya: menghormati ilmu, menghadirkan akhlak, membaca keadaan masyarakat, menggunakan kebudayaan sebagai jembatan, serta mengutamakan persatuan dan kemaslahatan.</p>
      <p>Dalam konteks Harlah NU ke-101, jejak ini mengingatkan bahwa perjuangan NU selalu memiliki akar sejarah yang panjang. Dari pesantren, makam para wali, pusat-pusat kebudayaan, hingga gerakan sosial hari ini, dakwah terus dilanjutkan melalui pendidikan, pelayanan umat, pemberdayaan ekonomi, dan cinta tanah air.</p>

      <aside class="article-note">
        <strong>Catatan editorial</strong>
        <p>Artikel ini merupakan rangkuman editorial untuk kebutuhan edukasi website Harlah NU, disusun berdasarkan referensi NU Online dan tidak menyalin artikel sumber secara utuh.</p>
      </aside>

      <section class="article-sources">
        <h2>Referensi</h2>
        <ul>
          <li><a href="https://nu.or.id/daerah/nu-kelanjutan-dari-gerakan-wali-songo-PX3kt" target="_blank" rel="noopener noreferrer">NU Kelanjutan dari Gerakan Wali Songo — NU Online</a></li>
          <li><a href="https://ftp.nu.or.id/wawancara/relasi-dakwah-islam-wali-songo-dengan-islam-nusantara-VnVjO" target="_blank" rel="noopener noreferrer">Relasi Dakwah Islam Wali Songo dengan Islam Nusantara — NU Online</a></li>
          <li><a href="https://www.nu.or.id/nasional/cara-wali-songo-mengislamkan-nusantara-DOKff" target="_blank" rel="noopener noreferrer">Cara Wali Songo Mengislamkan Nusantara — NU Online</a></li>
        </ul>
      </section>

      <div class="article-actions">
        <NuxtLink to="/sejarah-nu" class="button button--primary">Kembali ke Sejarah NU</NuxtLink>
        <NuxtLink to="/daftar" class="button button--secondary">Daftar Peserta</NuxtLink>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import walisongoImage from '~/assets/images/nu-dakwah-walisongo.png';

useSeoMeta({
  title: 'NU Melanjutkan Dakwah Wali Songo | Harlah NU ke-101',
  description: 'Artikel editorial tentang NU sebagai penerus dakwah Wali Songo, tradisi Aswaja, pesantren, kebudayaan, dan persatuan umat Nusantara.'
});
</script>

<style scoped>
.article-page { min-height: 100vh; background: radial-gradient(circle at 10% 0%, rgba(189,123,40,.08), transparent 28rem), #faf9f5; color: #29251f; }
.article-hero { position: relative; min-height: min(76vh, 760px); overflow: hidden; background: #4a2c16; color: #fff; }
.article-hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.article-hero__overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(25,14,7,.86), rgba(34,20,10,.38) 55%, rgba(34,20,10,.08)), linear-gradient(0deg, rgba(20,11,5,.68), transparent 42%); }
.article-hero__content { position: relative; z-index: 1; display: flex; min-height: min(76vh, 760px); width: min(100% - 2.5rem, 1120px); flex-direction: column; justify-content: end; margin: 0 auto; padding: 3rem 0 5.5rem; }
.article-back { align-self: flex-start; margin-bottom: auto; padding: .65rem .9rem; border: 1px solid rgba(255,255,255,.35); border-radius: 999px; background: rgba(20,11,5,.2); color: #fff3d8; font-size: .85rem; font-weight: 700; backdrop-filter: blur(8px); }
.eyebrow { display: flex; align-items: center; gap: .65rem; color: #f4cf88; font-size: .78rem; font-weight: 800; letter-spacing: .15em; }
.eyebrow span { width: 2rem; height: 1px; background: #f4cf88; }
h1, h2 { font-family: Georgia, 'Times New Roman', serif; line-height: 1.08; }
h1 { max-width: 12ch; margin-top: 1rem; text-wrap: balance; font-size: clamp(3rem, 8vw, 7rem); letter-spacing: -.035em; }
.article-summary { max-width: 38rem; margin-top: 1.5rem; color: #f8e9cf; font-size: clamp(1.05rem, 2vw, 1.35rem); line-height: 1.65; }
.article-meta { display: flex; flex-wrap: wrap; gap: .65rem; margin-top: 1.5rem; color: #f4cfaa; font-size: .86rem; font-weight: 700; }
.article-content { position: relative; width: min(100% - 2.5rem, 820px); margin: -2rem auto 0; padding: clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 5vw, 3.5rem) clamp(3rem, 7vw, 6rem); border: 1px solid rgba(76,43,24,.1); border-radius: 1.4rem 1.4rem 0 0; background: rgba(255,255,255,.92); box-shadow: 0 -16px 50px rgba(76,43,24,.1); }
.article-content__ornament { width: 3rem; height: 3rem; display: grid; place-items: center; margin: 0 auto 1.5rem; border: 1px solid rgba(189,123,40,.45); border-radius: 50%; color: #bd7b28; font-size: 1.2rem; }
.article-content h2 { margin-top: 3rem; color: #4c2b18; font-size: clamp(2rem, 4vw, 3.25rem); }
.article-content p { margin-top: 1.2rem; color: #5d554b; font-size: 1.08rem; line-height: 1.9; }
.article-content .article-lead { margin-top: 0; color: #3e3328; font-size: clamp(1.2rem, 2.5vw, 1.55rem); line-height: 1.8; }
.article-note { margin-top: 3rem; padding: 1.5rem 1.7rem; border: 1px solid rgba(189,123,40,.22); border-left: 4px solid #bd7b28; border-radius: 0 .9rem .9rem 0; background: linear-gradient(135deg, #f4ead7, #fbf4e7); }
.article-note strong { color: #4c2b18; }
.article-note p { margin-top: .5rem; font-size: .95rem; }
.article-sources { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(76,43,24,.16); }
.article-sources h2 { margin-top: 0; font-size: 2rem; }
.article-sources ul { display: grid; gap: .7rem; margin-top: 1rem; padding-left: 1.25rem; line-height: 1.6; }
.article-sources a { color: #6f3b19; text-decoration: underline; text-underline-offset: .15em; }
.article-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 3rem; }
.button { display: inline-flex; min-height: 2.9rem; align-items: center; justify-content: center; padding: .75rem 1.2rem; border-radius: .55rem; font-weight: 800; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
.button:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(76,43,24,.14); }
.button--primary { background: #4c2b18; color: #fff; }
.button--secondary { border: 1px solid #4c2b18; color: #4c2b18; }
@media (max-width: 700px) {
  .article-hero, .article-hero__content { min-height: 680px; }
  .article-hero > img { object-position: 58% center; }
  .article-hero__overlay { background: linear-gradient(180deg, rgba(25,14,7,.35), rgba(25,14,7,.78) 58%, rgba(20,11,5,.92)); }
  .article-hero__content { width: min(100% - 2rem, 560px); padding: 1.25rem 0 2.5rem; }
  .article-back { margin-bottom: auto; padding: .55rem .8rem; font-size: .78rem; }
  .eyebrow { flex-wrap: wrap; gap: .45rem; font-size: .68rem; letter-spacing: .11em; }
  .eyebrow span { width: 1.2rem; }
  h1 { max-width: 10ch; margin-top: .8rem; font-size: clamp(2.75rem, 13vw, 4.4rem); line-height: .98; }
  .article-summary { margin-top: 1.15rem; font-size: 1rem; line-height: 1.55; }
  .article-meta { gap: .45rem; margin-top: 1.15rem; font-size: .76rem; }
  .article-content { width: min(100% - 1rem, 820px); margin-top: -1rem; padding: 2.25rem 1.15rem 3.5rem; border-radius: 1rem 1rem 0 0; }
  .article-content__ornament { width: 2.6rem; height: 2.6rem; margin-bottom: 1.25rem; }
  .article-content p { font-size: 1rem; line-height: 1.8; }
  .article-content .article-lead { font-size: 1.15rem; line-height: 1.7; }
  .article-content h2 { margin-top: 2.35rem; font-size: clamp(1.85rem, 9vw, 2.55rem); line-height: 1.08; }
  .article-note { margin-top: 2.25rem; padding: 1.15rem 1rem; }
  .article-sources { margin-top: 2.25rem; padding-top: 1.5rem; }
  .article-sources h2 { font-size: 1.85rem; }
  .article-sources ul { padding-left: 1.05rem; font-size: .92rem; }
  .article-actions { display: grid; gap: .6rem; margin-top: 2.25rem; }
  .button { width: 100%; }
}
@media (max-width: 380px) {
  .article-hero, .article-hero__content { min-height: 640px; }
  h1 { font-size: 2.65rem; }
  .article-meta { font-size: .7rem; }
}
</style>
