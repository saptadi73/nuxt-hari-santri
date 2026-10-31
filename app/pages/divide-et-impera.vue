<template>
  <main class="article-page">
    <section class="article-hero">
      <img :src="aduDombaImage" alt="Ilustrasi politik adu domba kolonial Belanda di Nusantara">
      <div class="article-hero__overlay"></div>
      <div class="article-hero__content">
        <NuxtLink to="/#sejarah" class="article-back">← Sejarah Nusantara</NuxtLink>
        <p class="eyebrow">EDITORIAL SEJARAH <span></span> 10 / 2026</p>
        <h1>Divide et Impera</h1>
        <p class="article-summary">Politik adu domba Belanda yang memecah kekuatan lokal untuk menguasai Nusantara.</p>
        <div class="article-meta">
          <span>Harlah NU ke-101</span><span>•</span><span>Bacaan 4 menit</span>
        </div>
      </div>
    </section>

    <article class="article-content">
      <p class="article-kicker">POLITIK KOLONIAL</p>
      <p class="article-lead">Belanda tidak menguasai Nusantara hanya dengan kekuatan senjata. VOC dan pemerintah Hindia Belanda juga memakai <em>divide et impera</em>—memecah kekuatan yang besar, mempertajam perselisihan, lalu menguasai pihak-pihak yang telah terpisah.</p>

      <h2>Memanfaatkan retakan dari dalam</h2>
      <p>Politik adu domba biasanya tidak menciptakan konflik dari nol. Belanda membaca pertentangan di dalam kerajaan atau masyarakat, mendukung salah satu pihak, kemudian meminta imbalan. Pihak yang dibantu dapat dipaksa menyerahkan wilayah, monopoli perdagangan, atau sebagian kedaulatannya.</p>
      <p>Pola ini membuat kemenangan salah satu kelompok sering berujung pada ketergantungan baru. Ketika kekuatan lokal saling melemahkan, VOC tampil sebagai penengah sekaligus pihak yang paling diuntungkan.</p>

      <section class="case-grid" aria-label="Contoh politik adu domba">
        <article>
          <span>1755–1757</span>
          <h3>Mataram</h3>
          <p>Perang saudara dimanfaatkan VOC hingga Perjanjian Giyanti dan Salatiga membagi kekuasaan Mataram. Kerajaan yang semula besar terpecah dan semakin bergantung pada campur tangan kolonial.</p>
        </article>
        <article>
          <span>1682–1683</span>
          <h3>Banten</h3>
          <p>Perselisihan Sultan Ageng Tirtayasa dan Sultan Haji membuka jalan bagi VOC. Bantuan militer dibayar dengan konsesi perdagangan dan melemahnya kedaulatan Banten.</p>
        </article>
        <article>
          <span>1666–1667</span>
          <h3>Gowa dan Bone</h3>
          <p>VOC memanfaatkan pertentangan Gowa dan Bone dalam Perang Makassar. Perjanjian Bongaya kemudian membatasi kekuasaan Gowa dan memperkuat monopoli VOC.</p>
        </article>
        <article>
          <span>1821–1838</span>
          <h3>Minangkabau</h3>
          <p>Belanda masuk melalui konflik kaum Adat dan kaum Padri. Ketika keduanya akhirnya bersatu, kekuatan kolonial telanjur menanamkan pengaruh dan menguasai wilayah penting.</p>
        </article>
      </section>

      <h2>Dari konflik elite hingga pembelahan sosial</h2>
      <p>Di Aceh, pemerintah kolonial berusaha memisahkan ulama dari <em>uleebalang</em> atau pemimpin adat. Pada tingkat hukum, penduduk Hindia Belanda juga dibagi ke dalam golongan Eropa, Timur Asing, dan pribumi. Pembagian itu membentuk jarak sosial dan menghambat tumbuhnya rasa senasib.</p>

      <blockquote>
        <p>Inti politik adu domba adalah mengubah perbedaan menjadi permusuhan, lalu memakai perpecahan itu sebagai jalan menuju kekuasaan.</p>
      </blockquote>

      <h2>Pelajaran tentang persatuan</h2>
      <p>Sejarah menunjukkan bahwa pihak yang tampak “dimenangkan” oleh kolonial pada akhirnya ikut kehilangan kemandirian. Sebaliknya, persatuan mampu mempersempit ruang bagi politik pecah belah. Pengalaman panjang ini ikut melahirkan kesadaran baru: perjuangan tidak cukup dilakukan sendiri-sendiri, tetapi membutuhkan organisasi, solidaritas, dan tujuan kebangsaan bersama.</p>
      <p>Mengingat <em>divide et impera</em> bukan sekadar menengok masa lalu. Ia menjadi pengingat agar perbedaan suku, agama, golongan, dan pilihan politik tidak diolah menjadi permusuhan yang merusak persaudaraan.</p>

      <aside class="article-note">
        <strong>Catatan editorial</strong>
        <p>Artikel ini merupakan versi ringkas dari naskah “Devide et Impera: Politik Adu Domba Belanda di Nusantara” untuk kebutuhan edukasi website Harlah NU.</p>
      </aside>

      <section class="article-sources">
        <h2>Referensi pilihan</h2>
        <ul>
          <li><a href="https://ejournal.radenintan.ac.id/index.php/TAPIs/article/download/14288/8832/45842" target="_blank" rel="noopener noreferrer">Kajian strategi politik divide et impera — UIN Raden Intan</a></li>
          <li><a href="https://lampungprov.go.id/index.php/pages/sejarah-lampung" target="_blank" rel="noopener noreferrer">Sejarah Lampung dan monopoli VOC — Pemerintah Provinsi Lampung</a></li>
          <li><a href="https://epaper.myedisi.com/bse/44506/index_130.html" target="_blank" rel="noopener noreferrer">Sejarah Indonesia: Perang Padri — Kemendikbud</a></li>
          <li><a href="https://webpresentations.universiteitleiden.nl/s/Snouck-eng/page/aceh" target="_blank" rel="noopener noreferrer">Snouck Hurgronje dan Aceh — Universiteit Leiden</a></li>
        </ul>
      </section>

      <div class="article-actions">
        <NuxtLink to="/#sejarah" class="button button--primary">Kembali ke Beranda</NuxtLink>
        <NuxtLink to="/sejarah-nu" class="button button--secondary">Baca Sejarah NU</NuxtLink>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import aduDombaImage from '~/assets/images/adu domba.jpg';

useSeoMeta({
  title: 'Divide et Impera: Politik Adu Domba di Nusantara | Harlah NU',
  description: 'Artikel ringkas tentang politik divide et impera Belanda, contoh penerapannya di Nusantara, dan pelajaran penting tentang persatuan.'
});
</script>

<style scoped>
.article-page { min-height: 100vh; background: radial-gradient(circle at 12% 0%, rgba(248,184,21,.12), transparent 30rem), #f8f7f0; color: #17352c; }
.article-hero { position: relative; min-height: min(76vh, 760px); overflow: hidden; background: #052f20; color: #fff; }
.article-hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.article-hero__overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(3,35,23,.94), rgba(5,60,39,.62) 52%, rgba(5,45,31,.18)), linear-gradient(0deg, rgba(3,29,20,.76), transparent 45%); }
.article-hero__content { position: relative; z-index: 1; display: flex; min-height: min(76vh, 760px); width: min(100% - 2.5rem, 1120px); flex-direction: column; justify-content: end; margin: 0 auto; padding: 3rem 0 5.5rem; }
.article-back { align-self: flex-start; margin-bottom: auto; padding: .65rem .9rem; border: 1px solid rgba(255,255,255,.34); border-radius: 999px; background: rgba(3,35,23,.3); color: #fff7d6; font-size: .85rem; font-weight: 800; backdrop-filter: blur(8px); }
.eyebrow { display: flex; align-items: center; gap: .65rem; color: #ffd35c; font-size: .78rem; font-weight: 900; letter-spacing: .15em; }
.eyebrow span { width: 2rem; height: 1px; background: #ffd35c; }
h1, h2, h3 { font-family: Georgia, 'Times New Roman', serif; }
h1 { max-width: 11ch; margin-top: 1rem; font-size: clamp(3.6rem, 9vw, 8rem); line-height: .95; letter-spacing: -.04em; }
.article-summary { max-width: 42rem; margin-top: 1.5rem; color: #f7f3df; font-size: clamp(1.05rem, 2vw, 1.35rem); line-height: 1.65; }
.article-meta { display: flex; flex-wrap: wrap; gap: .65rem; margin-top: 1.5rem; color: #ffdc76; font-size: .86rem; font-weight: 800; }
.article-content { position: relative; width: min(100% - 2.5rem, 880px); margin: -2rem auto 0; padding: clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 5vw, 3.8rem) clamp(3rem, 7vw, 6rem); border: 1px solid rgba(7,91,54,.12); border-radius: 1.4rem 1.4rem 0 0; background: rgba(255,255,255,.95); box-shadow: 0 -16px 50px rgba(7,70,45,.12); }
.article-kicker { margin: 0 0 1rem !important; color: #8a6b20 !important; font-size: .74rem !important; font-weight: 900; letter-spacing: .18em; }
.article-content h2 { margin-top: 3rem; color: #075b36; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.08; }
.article-content p { margin-top: 1.15rem; color: #50645a; font-size: 1.06rem; line-height: 1.88; }
.article-content .article-lead { margin-top: 0; color: #243d33; font-size: clamp(1.2rem, 2.5vw, 1.5rem); line-height: 1.75; }
.case-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 2.5rem; }
.case-grid article { padding: 1.35rem; border: 1px solid rgba(7,91,54,.14); border-radius: 1rem; background: linear-gradient(145deg, #f5f8ee, #fff); }
.case-grid span { color: #9a7415; font-size: .72rem; font-weight: 900; letter-spacing: .1em; }
.case-grid h3 { margin-top: .45rem; color: #075b36; font-size: 1.55rem; }
.case-grid p { margin-top: .65rem; font-size: .92rem; line-height: 1.7; }
blockquote { margin: 2.75rem 0 0; padding: 1.5rem 1.7rem; border-left: 5px solid #f8b815; border-radius: 0 1rem 1rem 0; background: #075b36; }
blockquote p { margin: 0 !important; color: #fff8db !important; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.2rem, 3vw, 1.6rem) !important; line-height: 1.55 !important; }
.article-note { margin-top: 3rem; padding: 1.4rem 1.6rem; border: 1px solid rgba(7,91,54,.16); border-left: 4px solid #85be36; border-radius: 0 .9rem .9rem 0; background: linear-gradient(135deg, #edf6e6, #fbf9e9); }
.article-note strong { color: #075b36; }
.article-note p { margin-top: .45rem; font-size: .94rem; }
.article-sources { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(7,91,54,.16); }
.article-sources h2 { margin-top: 0; font-size: 2rem; }
.article-sources ul { display: grid; gap: .7rem; margin-top: 1rem; padding-left: 1.2rem; line-height: 1.6; }
.article-sources a { color: #075b36; text-decoration: underline; text-underline-offset: .16em; }
.article-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 3rem; }
.button { display: inline-flex; min-height: 2.9rem; align-items: center; justify-content: center; padding: .75rem 1.2rem; border-radius: .55rem; font-weight: 900; transition: transform .2s ease, box-shadow .2s ease; }
.button:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(7,70,45,.14); }
.button--primary { background: #075b36; color: #fff; }
.button--secondary { border: 1px solid #075b36; color: #075b36; }
@media (max-width: 700px) {
  .article-hero, .article-hero__content { min-height: 680px; }
  .article-hero > img { object-position: 55% center; }
  .article-hero__overlay { background: linear-gradient(180deg, rgba(3,35,23,.32), rgba(3,35,23,.78) 55%, rgba(2,27,18,.96)); }
  .article-hero__content { width: min(100% - 2rem, 560px); padding: 1.25rem 0 2.5rem; }
  .article-back { margin-bottom: auto; padding: .55rem .8rem; font-size: .78rem; }
  .eyebrow { flex-wrap: wrap; font-size: .68rem; letter-spacing: .11em; }
  h1 { font-size: clamp(3rem, 16vw, 5rem); }
  .article-summary { font-size: 1rem; line-height: 1.55; }
  .article-meta { font-size: .76rem; }
  .article-content { width: min(100% - 1rem, 880px); margin-top: -1rem; padding: 2.25rem 1.15rem 3.5rem; border-radius: 1rem 1rem 0 0; }
  .article-content p { font-size: 1rem; line-height: 1.78; }
  .article-content .article-lead { font-size: 1.13rem; line-height: 1.68; }
  .article-content h2 { margin-top: 2.35rem; font-size: clamp(1.85rem, 9vw, 2.55rem); }
  .case-grid { grid-template-columns: 1fr; margin-top: 2rem; }
  blockquote { margin-top: 2.25rem; padding: 1.25rem; }
  .article-actions { display: grid; }
  .button { width: 100%; }
}
</style>
