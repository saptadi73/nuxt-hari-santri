<template>
  <main class="article-page">
    <section class="article-hero">
      <img
        :src="independenceImage"
        alt="Ilustrasi perjuangan rakyat dan diplomasi Indonesia mempertahankan kemerdekaan 1945 hingga 1949"
        fetchpriority="high"
      >
      <div class="article-hero__overlay"></div>
      <div class="article-hero__content">
        <NuxtLink to="/#sejarah" class="article-back">← Sejarah Nusantara</NuxtLink>
        <p class="eyebrow">EDITORIAL SEJARAH <span></span> 1945–1949</p>
        <h1>Perjuangan Berlanjut</h1>
        <p class="article-summary">Dari Ambarawa, Medan, dan Bandung hingga meja perundingan internasional, rakyat dan diplomat Republik menempuh dua jalan yang saling menguatkan.</p>
        <div class="article-meta">
          <span>Harlah NU ke-101</span><span>•</span><span>Bacaan 9 menit</span>
        </div>
      </div>
      <p class="illustration-note">Ilustrasi sejarah, bukan foto dokumentasi peristiwa.</p>
    </section>

    <article class="article-content">
      <p class="article-kicker">1945 DAN SESUDAHNYA</p>
      <p class="article-lead">Pertempuran Surabaya bukan akhir perjuangan, melainkan awal dari empat tahun panjang mempertahankan kemerdekaan. Perlawanan berlangsung di berbagai daerah, sementara para diplomat Republik berjuang di meja perundingan dan forum internasional.</p>
      <p>Dua jalur itu tidak berjalan sendiri-sendiri. Keberanian rakyat memberi daya tawar bagi diplomasi, sedangkan pengakuan internasional mempersempit ruang bagi operasi militer Belanda. Perjuangan berlanjut hingga penyerahan kedaulatan pada 27 Desember 1949.</p>

      <section class="two-fronts" aria-label="Dua jalur perjuangan kemerdekaan">
        <article>
          <span>MEDAN PERLAWANAN</span>
          <h2>Menjaga wilayah Republik</h2>
          <p>Tentara, laskar, santri, pemuda, dan warga menghadapi Sekutu serta NICA melalui pertempuran terbuka, pengungsian, bumi hangus, dan perang gerilya.</p>
        </article>
        <article>
          <span>MEJA DIPLOMASI</span>
          <h2>Membangun pengakuan dunia</h2>
          <p>Delegasi Indonesia berunding sambil membawa bukti bahwa Republik tetap memiliki pemerintahan, tentara, wilayah, dan dukungan rakyat.</p>
        </article>
      </section>

      <h2>Palagan Ambarawa</h2>
      <p>Pada Oktober 1945, pasukan Sekutu mendarat di Semarang untuk mengurus tawanan perang. Kehadiran NICA dan tindakan mempersenjatai bekas tawanan Belanda memicu bentrokan yang meluas dari Magelang ke Ambarawa.</p>
      <p>Setelah Letkol Isdiman gugur, Kolonel Soedirman mengambil alih pimpinan. Ia menerapkan siasat <em>supit urang</em>: pasukan lawan dijepit dari dua sisi dan jalur mundurnya diputus. Pengepungan berlangsung empat hari empat malam hingga pasukan Sekutu mundur ke Semarang pada 15 Desember 1945.</p>

      <h2>Medan Area</h2>
      <p>Pasukan Sekutu di bawah Brigadir T.E.D. Kelly mendarat di Belawan pada 9 Oktober 1945 bersama pejabat NICA. Bentrokan pecah setelah insiden lencana Merah Putih pada 13 Oktober, lalu meluas menjadi pertempuran di Medan dan sekitarnya.</p>
      <p>Papan bertuliskan <em>Fixed Boundaries Medan Area</em> dipasang untuk membatasi gerak pejuang. Setelah Sekutu menguasai kota pada April 1946, pasukan Republik mundur dan meneruskan perlawanan dari luar Medan. Laskar serta tentara membentuk komando bersama dan bergerilya hingga Agresi Militer Belanda I.</p>

      <h2>Bandung Lautan Api</h2>
      <p>Ultimatum Sekutu menuntut pasukan Indonesia dan warga mengosongkan Bandung. Para pejuang memilih mundur, tetapi tidak menyerahkan kota sebagai pangkalan yang utuh bagi Sekutu dan NICA.</p>
      <p>Pada 24 Maret 1946, sekitar dua ratus ribu warga meninggalkan Bandung menuju pegunungan selatan. Bangunan-bangunan penting dibumihanguskan. Di Dayeuhkolot, Mohammad Toha dan Ramdan meledakkan gudang mesiu milik Sekutu dan gugur dalam tugas tersebut.</p>

      <blockquote>
        <p>Perjuangan mempertahankan kemerdekaan berlangsung di jalan, hutan, desa, kota, ruang perundingan, dan forum dunia—semuanya menjaga Republik tetap hidup.</p>
      </blockquote>

      <section class="regional-grid" aria-labelledby="regional-title">
        <div class="regional-grid__heading">
          <p class="article-kicker">PERLAWANAN DAERAH</p>
          <h2 id="regional-title">Satu Republik, banyak medan</h2>
        </div>
        <article><span>15 DES 1945</span><h3>Ambarawa</h3><p>Siasat pengepungan TKR memaksa Sekutu mundur dan mengangkat nama Soedirman sebagai pemimpin militer.</p></article>
        <article><span>1945–1947</span><h3>Medan Area</h3><p>Perlawanan berlanjut dari dalam hingga luar kota melalui komando laskar dan perang gerilya.</p></article>
        <article><span>24 MAR 1946</span><h3>Bandung</h3><p>Warga mengungsi dan membumihanguskan kota agar tidak menjadi pangkalan lawan.</p></article>
        <article><span>1947–1949</span><h3>Gerilya Nasional</h3><p>Ketika kota dan wilayah produktif direbut, pasukan Republik bertahan dengan mobilitas serta dukungan rakyat.</p></article>
      </section>

      <h2>Dua Agresi Militer Belanda</h2>
      <div class="aggression-list">
        <article>
          <p class="article-kicker">21 JULI–5 AGUSTUS 1947</p>
          <h3>Agresi Militer Belanda I</h3>
          <p>Belanda menyerang wilayah ekonomi penting di Jawa dan Sumatra. Pasukan Republik menghindari pertempuran terbuka, merusak jalur logistik, menyergap konvoi, dan beralih ke gerilya. Tekanan Dewan Keamanan PBB akhirnya mendorong penghentian serangan.</p>
        </article>
        <article>
          <p class="article-kicker">19 DESEMBER 1948</p>
          <h3>Agresi Militer Belanda II</h3>
          <p>Belanda menyerang Yogyakarta dan menangkap pemimpin Republik. Pemerintahan Darurat Republik Indonesia dibentuk di Sumatra, sedangkan Panglima Besar Soedirman memimpin gerilya. Republik tetap berjalan meskipun ibu kotanya diduduki.</p>
        </article>
      </div>

      <aside class="highlight-card">
        <p class="highlight-card__date">1 MARET 1949 · YOGYAKARTA</p>
        <h2>Enam jam yang menggugurkan propaganda</h2>
        <p>Dalam Serangan Umum 1 Maret 1949, TNI menguasai Yogyakarta selama beberapa jam. Aksi itu membantah klaim Belanda bahwa Republik dan angkatan perangnya telah hancur, sekaligus memperkuat posisi Indonesia di forum internasional.</p>
      </aside>

      <h2>Diplomasi dari Linggarjati ke Den Haag</h2>
      <p>Perundingan sering berjalan sulit dan hasilnya berulang kali dilanggar. Namun, setiap tahap membawa persoalan Indonesia semakin kuat ke perhatian dunia.</p>
      <section class="diplomacy-list" aria-label="Tahapan diplomasi Indonesia 1946 hingga 1949">
        <article><time>1946–1947</time><div><h3>Linggarjati</h3><p>Belanda mengakui secara de facto kekuasaan Republik atas Jawa, Madura, dan Sumatra. Kesepakatan kemudian runtuh setelah Agresi Militer I.</p></div></article>
        <article><time>17 JAN 1948</time><div><h3>Renville</h3><p>Republik menerima garis Van Mook dan menarik pasukan dari sejumlah kantong gerilya, termasuk hijrahnya Divisi Siliwangi ke Jawa Tengah.</p></div></article>
        <article><time>7 MEI 1949</time><div><h3>Roem–Royen</h3><p>Belanda menyetujui penghentian operasi militer, pembebasan pemimpin Republik, dan pemulihan pemerintahan di Yogyakarta.</p></div></article>
        <article><time>23 AGU–2 NOV 1949</time><div><h3>Konferensi Meja Bundar</h3><p>Perundingan di Den Haag menghasilkan persetujuan penyerahan kedaulatan kepada Republik Indonesia Serikat.</p></div></article>
      </section>

      <h2>Pengakuan kedaulatan</h2>
      <p>Penyerahan kedaulatan berlangsung pada 27 Desember 1949. Meski bentuk negara saat itu adalah Republik Indonesia Serikat dan persoalan Irian Barat belum selesai, pengakuan tersebut menjadi penanda penting berakhirnya upaya Belanda menguasai kembali Indonesia. Pada Agustus 1950, Indonesia kembali menjadi negara kesatuan.</p>
      <p>Pelajaran periode 1945–1949 sangat jelas: kemenangan di medan tempur tanpa diplomasi akan sulit memperoleh pengakuan dunia, sementara diplomasi tanpa keteguhan rakyat tidak memiliki daya tawar yang kuat.</p>

      <section class="timeline" aria-labelledby="timeline-title">
        <p class="article-kicker">GARIS WAKTU 1945–1949</p>
        <h2 id="timeline-title">Empat tahun mempertahankan Republik</h2>
        <ol>
          <li><time>15 Des 1945</time><p>Kemenangan TKR dalam Palagan Ambarawa.</p></li>
          <li><time>24 Mar 1946</time><p>Bandung Lautan Api dan pengungsian besar warga.</p></li>
          <li><time>25 Mar 1947</time><p>Perjanjian Linggarjati ditandatangani.</p></li>
          <li><time>21 Jul 1947</time><p>Agresi Militer Belanda I dimulai.</p></li>
          <li><time>17 Jan 1948</time><p>Perjanjian Renville ditandatangani.</p></li>
          <li><time>19 Des 1948</time><p>Agresi Militer II; Yogyakarta diduduki dan PDRI dibentuk.</p></li>
          <li><time>1 Mar 1949</time><p>Serangan Umum di Yogyakarta.</p></li>
          <li><time>7 Mei 1949</time><p>Persetujuan Roem–Royen.</p></li>
          <li><time>27 Des 1949</time><p>Penyerahan kedaulatan kepada Republik Indonesia Serikat.</p></li>
        </ol>
      </section>

      <aside class="article-note">
        <strong>Catatan editorial</strong>
        <p>Artikel ini disusun dari naskah “1945 dan Sesudahnya: Perjuangan Berlanjut di Berbagai Daerah” untuk kebutuhan edukasi website Harlah NU. Gambar utama merupakan ilustrasi artistik yang merangkum banyak peristiwa, bukan dokumentasi satu pertempuran tertentu.</p>
      </aside>

      <section class="article-sources">
        <h2>Referensi pilihan</h2>
        <ul>
          <li><a href="https://www.detik.com/edu/detikpedia/d-7484055/sejarah-pertempuran-ambarawa-tahun-1945-dan-para-tokoh-yang-terlibat/amp" target="_blank" rel="noopener noreferrer">Sejarah Pertempuran Ambarawa — detikEdu</a></li>
          <li><a href="https://ejournal.unesa.ac.id/index.php/avatara/article/view/40961" target="_blank" rel="noopener noreferrer">Peranan Achmad Tahir dalam Medan Area — AVATARA Unesa</a></li>
          <li><a href="https://news.republika.co.id/berita/mk56kh/hari-ini-bandung-lautan-api" target="_blank" rel="noopener noreferrer">Bandung Lautan Api — Republika</a></li>
          <li><a href="https://www.goodnewsfromindonesia.id/ragam/nostalgia/kepungan-di-yogyakarta-menguak-sejarah-agresi-militer-belanda-ii" target="_blank" rel="noopener noreferrer">Agresi Militer Belanda II — GNFI</a></li>
          <li><a href="https://www.goodnewsfromindonesia.id/2024/10/30/perjanjian-roem-royen-titik-awal-akhir-kekuasaan-belanda-di-indonesia" target="_blank" rel="noopener noreferrer">Perjanjian Roem–Royen — GNFI</a></li>
          <li><a href="https://www.goodnewsfromindonesia.id/indonesiana/sejarah/sejarah-konferensi-meja-bundar-dan-hasilnya" target="_blank" rel="noopener noreferrer">Konferensi Meja Bundar — GNFI</a></li>
        </ul>
      </section>

      <div class="article-actions">
        <NuxtLink to="/#sejarah" class="button button--primary">Kembali ke Beranda</NuxtLink>
        <NuxtLink to="/divide-et-impera" class="button button--secondary">Jejak Perlawanan Nusantara</NuxtLink>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import independenceImage from '~/assets/images/perjuangan-kemerdekaan-indonesia.png';

useSeoMeta({
  title: 'Perjuangan Kemerdekaan di Berbagai Daerah 1945–1949 | Harlah NU',
  description: 'Perjuangan mempertahankan kemerdekaan dari Ambarawa, Medan, dan Bandung hingga agresi militer, diplomasi, serta pengakuan kedaulatan.',
  ogTitle: '1945 dan Sesudahnya: Perjuangan Berlanjut',
  ogDescription: 'Kisah perlawanan rakyat dan diplomasi Republik Indonesia sepanjang 1945–1949.',
  ogImage: independenceImage,
  twitterCard: 'summary_large_image'
});
</script>

<style scoped>
.article-page { min-height: 100vh; background: radial-gradient(circle at 12% 0%, rgba(196,30,36,.09), transparent 32rem), #f7f5ed; color: #17352c; }
.article-hero { position: relative; min-height: min(82vh, 820px); overflow: hidden; background: #13251f; color: #fff; }
.article-hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; filter: contrast(1.04) saturate(.94); }
.article-hero__overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(4,31,23,.95), rgba(8,48,34,.64) 50%, rgba(24,25,21,.18)), linear-gradient(0deg, rgba(7,26,20,.84), transparent 52%); }
.article-hero__content { position: relative; z-index: 1; display: flex; min-height: min(82vh, 820px); width: min(100% - 2.5rem, 1120px); flex-direction: column; justify-content: end; margin: 0 auto; padding: 3rem 0 5.5rem; }
.article-back { align-self: flex-start; margin-bottom: auto; padding: .65rem .9rem; border: 1px solid rgba(255,255,255,.38); border-radius: 999px; background: rgba(4,31,23,.38); color: #fff4cf; font-size: .85rem; font-weight: 800; backdrop-filter: blur(8px); }
.eyebrow { display: flex; align-items: center; gap: .65rem; color: #ffd35c; font-size: .78rem; font-weight: 900; letter-spacing: .15em; }
.eyebrow span { width: 2rem; height: 1px; background: #ffd35c; }
h1, h2, h3 { font-family: Georgia, 'Times New Roman', serif; }
h1 { max-width: 11ch; margin-top: 1rem; font-size: clamp(3.6rem, 8.5vw, 7.4rem); line-height: .94; letter-spacing: -.045em; }
.article-summary { max-width: 48rem; margin-top: 1.5rem; color: #f7f3df; font-size: clamp(1.05rem, 2vw, 1.35rem); line-height: 1.65; }
.article-meta { display: flex; flex-wrap: wrap; gap: .65rem; margin-top: 1.5rem; color: #ffdc76; font-size: .86rem; font-weight: 800; }
.illustration-note { position: absolute; right: 1.25rem; bottom: 1rem; z-index: 2; margin: 0; color: rgba(255,255,255,.72); font-size: .72rem; }
.article-content { position: relative; width: min(100% - 2.5rem, 920px); margin: -2rem auto 0; padding: clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 5vw, 3.8rem) clamp(3rem, 7vw, 6rem); border: 1px solid rgba(7,91,54,.12); border-radius: 1.4rem 1.4rem 0 0; background: rgba(255,255,255,.96); box-shadow: 0 -16px 50px rgba(7,70,45,.12); }
.article-kicker { margin: 0 0 1rem !important; color: #9b7416 !important; font-size: .74rem !important; font-weight: 900; letter-spacing: .18em; }
.article-content h2 { margin-top: 3rem; color: #075b36; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.08; }
.article-content h3 { color: #075b36; }
.article-content p { margin-top: 1.15rem; color: #50645a; font-size: 1.06rem; line-height: 1.88; }
.article-content .article-lead { margin-top: 0; color: #243d33; font-size: clamp(1.2rem, 2.5vw, 1.5rem); line-height: 1.75; }
.two-fronts { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1rem; margin-top: 3rem; }
.two-fronts article { padding: clamp(1.4rem,4vw,2.1rem); border-radius: 1.1rem; background: linear-gradient(145deg, #075b36, #0a7042); box-shadow: 0 16px 35px rgba(7,70,45,.15); }
.two-fronts span { color: #ffd35c; font-size: .72rem; font-weight: 900; letter-spacing: .14em; }
.two-fronts h2 { margin-top: .7rem; color: #fff; font-size: 2rem; }
.two-fronts p { color: #eaf4e7; font-size: .96rem; line-height: 1.7; }
blockquote { margin: 2.75rem 0 0; padding: 1.6rem 1.8rem; border-left: 5px solid #f8b815; border-radius: 0 1rem 1rem 0; background: #17352c; }
blockquote p { margin: 0 !important; color: #fff8db !important; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.2rem,3vw,1.65rem) !important; line-height: 1.55 !important; }
.regional-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 1rem; margin-top: 3.2rem; }
.regional-grid__heading { grid-column: 1/-1; }
.regional-grid__heading h2 { margin-top: .4rem; }
.regional-grid article, .aggression-list article { padding: 1.45rem; border: 1px solid rgba(7,91,54,.14); border-radius: 1rem; background: linear-gradient(145deg,#f2f7ec,#fff); }
.regional-grid article span { color: #b1871c; font-size: .72rem; font-weight: 900; letter-spacing: .12em; }
.regional-grid h3, .aggression-list h3 { margin-top: .5rem; font-size: 1.5rem; }
.regional-grid article p, .aggression-list article p { margin-top: .65rem; font-size: .94rem; line-height: 1.7; }
.aggression-list { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 1rem; margin-top: 2rem; }
.aggression-list .article-kicker { margin-bottom: .5rem !important; }
.highlight-card { margin-top: 3rem; padding: clamp(1.5rem,4vw,2.4rem); border-radius: 1.2rem; background: linear-gradient(135deg,#064f32,#0a6a3e); box-shadow: 0 18px 40px rgba(6,79,50,.18); }
.highlight-card .highlight-card__date { margin: 0; color: #ffd35c; font-size: .75rem; font-weight: 900; letter-spacing: .16em; }
.highlight-card h2 { margin: .7rem 0 0; color: #fff; }
.highlight-card p { color: #ecf5e9; }
.diplomacy-list { display: grid; margin-top: 2rem; }
.diplomacy-list article { display: grid; grid-template-columns: 10rem 1fr; gap: 1.4rem; padding: 1.25rem 0; border-top: 1px solid rgba(7,91,54,.14); }
.diplomacy-list time { color: #9b7416; font-size: .76rem; font-weight: 900; letter-spacing: .08em; }
.diplomacy-list h3 { font-size: 1.55rem; }
.diplomacy-list p { margin-top: .4rem; font-size: .96rem; line-height: 1.68; }
.timeline { margin-top: 3.5rem; padding: clamp(1.4rem,4vw,2.3rem); border-radius: 1.2rem; background: #f3f6ed; }
.timeline h2 { margin-top: .4rem; }
.timeline ol { display: grid; margin-top: 1.7rem; padding: 0; list-style: none; }
.timeline li { display: grid; grid-template-columns: 9.5rem 1fr; gap: 1.2rem; padding: 1rem 0; border-top: 1px solid rgba(7,91,54,.14); }
.timeline time { color: #8d6813; font-size: .8rem; font-weight: 900; letter-spacing: .06em; }
.timeline li p { margin: 0; color: #314c40; font-size: .96rem; line-height: 1.6; }
.article-note { margin-top: 3rem; padding: 1.4rem 1.6rem; border: 1px solid rgba(7,91,54,.16); border-left: 4px solid #85be36; border-radius: 0 .9rem .9rem 0; background: linear-gradient(135deg,#edf6e6,#fbf9e9); }
.article-note strong { color: #075b36; }
.article-note p { margin-top: .45rem; font-size: .94rem; }
.article-sources { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(7,91,54,.16); }
.article-sources h2 { margin-top: 0; font-size: 2rem; }
.article-sources ul { display: grid; gap: .7rem; margin-top: 1rem; padding-left: 1.2rem; line-height: 1.6; }
.article-sources a { color: #075b36; text-decoration: underline; text-underline-offset: .16em; }
.article-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 3rem; }
.button { display: inline-flex; min-height: 2.9rem; align-items: center; justify-content: center; padding: .75rem 1.2rem; border-radius: .55rem; font-weight: 900; transition: transform .2s ease,box-shadow .2s ease; }
.button:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(7,70,45,.14); }
.button--primary { background: #075b36; color: #fff; }
.button--secondary { border: 1px solid #075b36; color: #075b36; }
@media (max-width:700px) {
  .article-hero,.article-hero__content { min-height: 720px; }
  .article-hero > img { object-position: 53% center; }
  .article-hero__overlay { background: linear-gradient(180deg,rgba(3,35,23,.28),rgba(3,35,23,.77) 48%,rgba(2,27,18,.97)); }
  .article-hero__content { width: min(100% - 2rem,560px); padding: 1.25rem 0 3rem; }
  .article-back { margin-bottom: auto; padding: .55rem .8rem; font-size: .78rem; }
  .eyebrow { flex-wrap: wrap; font-size: .67rem; letter-spacing: .1em; }
  h1 { font-size: clamp(3rem,15vw,5rem); }
  .article-summary { font-size: 1rem; line-height: 1.55; }
  .article-meta { font-size: .76rem; }
  .illustration-note { right: 1rem; bottom: .6rem; font-size: .64rem; }
  .article-content { width: min(100% - 1rem,920px); margin-top: -1rem; padding: 2.25rem 1.15rem 3.5rem; border-radius: 1rem 1rem 0 0; }
  .article-content p { font-size: 1rem; line-height: 1.78; }
  .article-content .article-lead { font-size: 1.13rem; line-height: 1.68; }
  .article-content h2 { margin-top: 2.35rem; font-size: clamp(1.85rem,9vw,2.55rem); }
  .two-fronts,.regional-grid,.aggression-list { grid-template-columns: 1fr; }
  blockquote { margin-top: 2.25rem; padding: 1.25rem; }
  .diplomacy-list article,.timeline li { grid-template-columns: 1fr; gap: .35rem; }
  .timeline { padding: 1.2rem; }
  .article-actions { display: grid; }
  .button { width: 100%; }
}
</style>
