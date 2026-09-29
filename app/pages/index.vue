<template>
  <div class="portal-home">
    <section class="hero" aria-labelledby="hero-title">
      <img
        class="hero__image"
        :src="heroImage"
        alt="Pesepeda bergerak bersama di jalan terbuka"
        fetchpriority="high"
        width="2400"
        height="1500"
      >
      <div class="hero__shade" aria-hidden="true" />
      <div class="hero__content">
        <p class="eyebrow">{{ locale === 'id' ? 'MWC NU Tarumajaya mempersembahkan' : 'Presented by MWC NU Tarumajaya' }}</p>
        <h1 id="hero-title">{{ locale === 'id' ? 'Sepeda Sehat dan Jalan Sehat Keluarga' : 'Healthy Cycling & Family Walk' }}</h1>
        <p class="hero__subtitle">Hari Santri 2026</p>
        <p class="hero__lead">{{ locale === 'id' ? 'Sehat bersama, eratkan persaudaraan, rayakan semangat santri.' : 'Move together, strengthen friendship, and celebrate the spirit of the santri.' }}</p>
        <div class="hero__facts">
          <span>{{ locale === 'id' ? 'Minggu, 25 Oktober 2026' : 'Sunday, 25 October 2026' }}</span>
          <span>Summarecon Crown Gading</span>
          <span>Tarumajaya, Bekasi</span>
        </div>
        <div class="hero__actions">
          <NuxtLink to="/daftar" class="button button--light">{{ locale === 'id' ? 'Daftar Peserta' : 'Register Participants' }}</NuxtLink>
          <a href="#kegiatan" class="text-link">{{ locale === 'id' ? 'Lihat Kegiatan' : 'Explore Activities' }} <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <p class="hero__index" aria-hidden="true">01 / 25.10.26</p>
    </section>

    <section id="tentang" class="intro band">
      <div class="content-grid">
        <p class="section-number">01 <span>/ {{ locale === 'id' ? 'Tentang Acara' : 'About' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Satu hari untuk bergerak, bertemu, dan berbagi.' : 'A day to move, meet, and share.' }}</h2>
          <p class="lead-copy">{{ locale === 'id' ? 'Dalam rangka Hari Santri, MWC NU Tarumajaya mengajak keluarga dan warga untuk menikmati Sepeda Sehat dan Jalan Sehat Keluarga. Rayakan kebersamaan, dukung bazar lokal, dan ikuti semangat belajar serta kepedulian yang diwariskan para santri.' : 'For Santri Day, MWC NU Tarumajaya welcomes families and neighbors to join a healthy cycling event and family walk. Celebrate together, support local vendors, and carry forward the spirit of learning and care.' }}</p>
          <div class="event-facts">
            <div><span>{{ locale === 'id' ? 'Penyelenggara' : 'Organizer' }}</span><strong>MWC NU Tarumajaya</strong></div>
            <div><span>{{ locale === 'id' ? 'Tanggal' : 'Date' }}</span><strong>{{ locale === 'id' ? 'Minggu, 25 Oktober 2026' : 'Sunday, 25 October 2026' }}</strong></div>
            <div><span>{{ locale === 'id' ? 'Lokasi' : 'Venue' }}</span><strong>Summarecon Crown Gading, Tarumajaya, Bekasi</strong></div>
            <div><span>{{ locale === 'id' ? 'Waktu & titik kumpul' : 'Time & gathering point' }}</span><strong>{{ locale === 'id' ? 'Diumumkan panitia' : 'To be announced' }}</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section id="kegiatan" class="activities band band--paper">
      <div class="section-heading">
        <p class="section-number">02 <span>/ {{ locale === 'id' ? 'Kegiatan' : 'Activities' }}</span></p>
        <h2>{{ locale === 'id' ? 'Pilih langkahmu untuk Hari Santri.' : 'Choose your way to celebrate.' }}</h2>
      </div>
      <div class="activity-grid">
        <article class="activity activity--cycle">
          <p class="activity__label">01 / CYCLING</p>
          <h3>{{ locale === 'id' ? 'Sepeda Sehat' : 'Healthy Cycling' }}</h3>
          <p>{{ locale === 'id' ? 'Kayuh semangat kebersamaan menyusuri rute yang ditetapkan panitia. Ketentuan peserta, keselamatan, dan paket resmi akan ditampilkan setelah dikonfirmasi.' : 'Ride together along the route approved by the organizers. Eligibility, safety guidance, and official package details will appear once confirmed.' }}</p>
          <a href="#rute" class="text-link">{{ locale === 'id' ? 'Kenali rute' : 'View route' }} <span aria-hidden="true">→</span></a>
        </article>
        <article class="activity activity--walk">
          <p class="activity__label">02 / FAMILY WALK</p>
          <h3>{{ locale === 'id' ? 'Jalan Sehat Keluarga' : 'Family Walk' }}</h3>
          <p>{{ locale === 'id' ? 'Ajak orang tua, anak, dan sahabat berjalan bersama. Setiap anggota keluarga didaftarkan dengan data dan ukuran kaos masing-masing.' : 'Bring parents, children, and friends for a relaxed walk. Register each family member with their own details and shirt size.' }}</p>
          <a href="#rute" class="text-link">{{ locale === 'id' ? 'Kenali rute' : 'View route' }} <span aria-hidden="true">→</span></a>
        </article>
      </div>

      <div class="package-heading">
        <div>
          <p class="section-number">{{ locale === 'id' ? 'PAKET PESERTA' : 'PARTICIPANT PACKAGES' }}</p>
          <h3>{{ locale === 'id' ? 'Harga dan kuota resmi' : 'Official prices and availability' }}</h3>
        </div>
        <p>{{ locale === 'id' ? 'Harga, manfaat, periode, dan kuota ditentukan panitia dan dimuat dari server.' : 'Prices, inclusions, sales period, and capacity are managed by the organizers and loaded from the server.' }}</p>
      </div>
      <p v-if="packagesLoading" class="package-state">{{ locale === 'id' ? 'Memuat paket…' : 'Loading packages…' }}</p>
      <div v-else-if="products.length" class="package-list">
        <article v-for="item in products" :key="item.id" class="package-row">
          <div><h4>{{ item.name }}</h4><p>{{ item.description || (locale === 'id' ? 'Rincian paket mengikuti pengumuman resmi panitia.' : 'Package details will follow the organizers’ official announcement.') }}</p></div>
          <div class="package-row__price">{{ formatPrice(Number(item.price ?? item.amount ?? 0), item.currency) }}</div>
          <NuxtLink to="/daftar" class="button button--dark">{{ locale === 'id' ? 'Pilih Paket' : 'Select Package' }}</NuxtLink>
        </article>
      </div>
      <div v-else class="package-state">
        <p>{{ locale === 'id' ? 'Paket resmi, harga, isi, dan kuota akan diumumkan panitia.' : 'Official packages, prices, inclusions, and capacity will be announced by the organizers.' }}</p>
        <NuxtLink to="/daftar" class="text-link">{{ locale === 'id' ? 'Lihat formulir pendaftaran' : 'Open registration' }} <span aria-hidden="true">→</span></NuxtLink>
      </div>
      <p class="small-note">{{ locale === 'id' ? 'Setiap peserta memilih ukuran kaos secara terpisah. Harga yang berlaku adalah harga pada ringkasan pesanan sebelum pembayaran.' : 'Each participant selects a shirt size separately. The price shown in the server-side order summary is final.' }}</p>
    </section>

    <section id="rute" class="routes band">
      <div class="section-heading">
        <p class="section-number">03 <span>/ {{ locale === 'id' ? 'Rute' : 'Routes' }}</span></p>
        <h2>{{ locale === 'id' ? 'Kenali rute sebelum memulai.' : 'Know your route before setting out.' }}</h2>
      </div>
      <div class="route-grid">
        <article><span>CYCLING</span><h3>{{ locale === 'id' ? 'Sepeda Sehat' : 'Healthy Cycling' }}</h3><p>{{ locale === 'id' ? 'Peta, jarak, titik start/finish, dan titik bantuan ditampilkan setelah disahkan panitia.' : 'Map, distance, start/finish, and assistance points will be published after organizer approval.' }}</p></article>
        <article><span>FAMILY WALK</span><h3>{{ locale === 'id' ? 'Jalan Sehat Keluarga' : 'Family Walk' }}</h3><p>{{ locale === 'id' ? 'Periksa versi rute terbaru sebelum acara. Anak berjalan bersama orang tua atau wali.' : 'Check the latest route version before the event. Children should stay with a parent or guardian.' }}</p></article>
      </div>
      <p class="safety-note">{{ locale === 'id' ? 'Ikuti arahan petugas dan rambu. Bantuan medis tersedia melalui petugas di lapangan.' : 'Follow marshal instructions and route signs. Ask an on-site marshal for medical assistance.' }}</p>
    </section>

    <section id="agenda" class="agenda band band--paper">
      <div class="content-grid">
        <p class="section-number">04 <span>/ {{ locale === 'id' ? 'Agenda' : 'Agenda' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Satu hari, banyak momen bersama.' : 'One day, many moments together.' }}</h2>
          <p class="small-note">{{ locale === 'id' ? 'Daftar ini adalah susunan segmen CMS, bukan jadwal jam yang telah ditetapkan. Jam dan lokasi diterbitkan setelah terkonfirmasi.' : 'These are CMS program segments, not confirmed times. Times and locations will be published when confirmed.' }}</p>
          <ol class="agenda-list">
            <li v-for="(item, index) in agendaItems" :key="item.id"><span>0{{ index + 1 }}</span><strong>{{ item.id }}</strong><p>{{ item.copy }}</p><em>{{ locale === 'id' ? 'Waktu diumumkan' : 'Time to be announced' }}</em></li>
          </ol>
        </div>
      </div>
    </section>

    <section id="pengisi-acara" class="performers band">
      <div class="section-heading">
        <p class="section-number">05 <span>/ {{ locale === 'id' ? 'Pengisi Acara' : 'Performers' }}</span></p>
        <h2>{{ locale === 'id' ? 'Bertemu di panggung Hari Santri.' : 'Meet us at the Santri Day stage.' }}</h2>
      </div>
      <p class="lead-copy">{{ locale === 'id' ? 'Sholawat, pesan kebersamaan, penampilan komunitas, dan hiburan keluarga akan diumumkan setelah kehadiran pengisi acara dikonfirmasi.' : 'Sholawat, messages of togetherness, community performances, and family entertainment will be announced when confirmed.' }}</p>
      <p class="performer-empty">{{ locale === 'id' ? 'Pengisi acara segera diumumkan.' : 'Performers will be announced soon.' }}</p>
    </section>

    <section id="hadiah" class="prizes band band--green">
      <div class="content-grid">
        <p class="section-number">06 <span>/ {{ locale === 'id' ? 'Hadiah' : 'Prizes' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Kejutan menyenangkan sepanjang acara.' : 'A little excitement throughout the day.' }}</h2>
          <p class="lead-copy">{{ locale === 'id' ? 'Hadiah, sponsor, jumlah, mekanisme pengundian, dan batas klaim akan ditampilkan setelah dikonfirmasi. Tiket tidak menjamin hadiah untuk setiap peserta.' : 'Prizes, sponsors, quantities, draw rules, and claim deadlines will be shown once confirmed. A ticket does not guarantee a prize.' }}</p>
          <p class="prize-empty">{{ locale === 'id' ? 'Hadiah terkonfirmasi akan diumumkan di sini.' : 'Confirmed prizes will be listed here.' }}</p>
        </div>
      </div>
    </section>

    <section id="bazar" class="bazaar band band--paper">
      <div class="content-grid">
        <p class="section-number">07 <span>/ {{ locale === 'id' ? 'Bazar & Voucher' : 'Bazaar & Vouchers' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Temui karya dan sajian pilihan.' : 'Discover local food, books, and makers.' }}</h2>
          <p class="lead-copy">{{ locale === 'id' ? 'Jelajahi kuliner halal, buku Islam, produk pesantren, busana muslim, dan produk keluarga dari tenant yang dikurasi panitia.' : 'Explore halal food, Islamic books, pesantren products, modest wear, and family goods from vendors selected by the organizers.' }}</p>
          <p class="small-note">{{ locale === 'id' ? 'Voucher hanya berlaku jika tercantum pada paket atau program resmi. Nilai, tenant penerima, dan masa berlaku diumumkan panitia.' : 'Vouchers apply only when included in an official package or program. Value, participating vendors, and expiry are set by the organizers.' }}</p>
          <NuxtLink to="/daftar-tenant" class="button button--dark">{{ locale === 'id' ? 'Daftar Tenant Bazar' : 'Apply as a Bazaar Tenant' }}</NuxtLink>
        </div>
      </div>
    </section>

    <section id="sejarah" class="history band">
      <div class="content-grid">
        <p class="section-number">08 <span>/ {{ locale === 'id' ? 'Sejarah Hari Santri' : 'Santri Day History' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Semangat santri dalam perjalanan bangsa.' : 'The santri spirit in Indonesia’s story.' }}</h2>
          <p>{{ locale === 'id' ? 'Hari Santri diperingati setiap 22 Oktober, berkaitan dengan Resolusi Jihad pada 22 Oktober 1945. Pemerintah menetapkannya melalui Keputusan Presiden Nomor 22 Tahun 2015.' : 'Santri Day is observed on 22 October, connected to the 22 October 1945 Resolution of Jihad. The government established the commemoration through Presidential Decree No. 22 of 2015.' }}</p>
          <p>{{ locale === 'id' ? 'Perlawanan rakyat Surabaya pada 10 November 1945 dikenang sebagai peristiwa besar dan diperingati sebagai Hari Pahlawan. Kisah perjuangan mengingatkan bahwa kemerdekaan dijaga bersama oleh banyak unsur masyarakat.' : 'The people’s resistance in Surabaya on 10 November 1945 is commemorated as Heroes’ Day. These histories remind us that independence was defended by many parts of society.' }}</p>
          <p>{{ locale === 'id' ? 'Semangat santri hidup dalam belajar, menjaga persaudaraan, peduli sesama, dan berbuat baik bagi lingkungan.' : 'The santri spirit lives on through learning, solidarity, care for others, and service to the community.' }}</p>
          <div class="history__sources"><a href="https://cdn.kemenag.go.id/storage/archives/1665973491.pdf" target="_blank" rel="noreferrer">{{ locale === 'id' ? 'Kementerian Agama' : 'Ministry of Religious Affairs' }}</a><a href="https://bpmpkaltara.kemdikbud.go.id/wp-content/uploads/2022/11/Pedoman-Peringatan-Hari-Pahlawan-Tahun-2022.pdf" target="_blank" rel="noreferrer">{{ locale === 'id' ? 'Pedoman Hari Pahlawan' : 'Heroes’ Day guidance' }}</a></div>
        </div>
      </div>
    </section>

    <section id="faq" class="faq band band--paper">
      <div class="content-grid">
        <p class="section-number">09 <span>/ FAQ</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Yang sering ditanyakan.' : 'Frequently asked questions.' }}</h2>
          <details v-for="item in faqItems" :key="item.question" class="faq-item"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details>
          <NuxtLink to="/daftar" class="button button--dark">{{ locale === 'id' ? 'Daftar Peserta' : 'Register Participants' }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import heroImage from '~/assets/images/hero_image_hari_santri.png';
import type { StoreProduct } from '~/composables/useStore';

const { locale } = useI18n();
const runtime = useRuntimeConfig();
const products = ref<StoreProduct[]>([]);
const packagesLoading = ref(true);
const eventService = useEvent();
const store = useStore();

const agendaItems = computed(() => locale.value === 'id' ? [
  { id: 'Kedatangan & registrasi', copy: 'Datang lebih awal, siapkan tiket digital, dan ikuti petunjuk menuju area acara.' },
  { id: 'Pembukaan', copy: 'Kita awali perayaan Hari Santri dengan sambutan dan doa bersama.' },
  { id: 'Pelepasan kegiatan', copy: 'Bersiap di titik start dan ikuti arahan petugas untuk kegiatan pilihanmu.' },
  { id: 'Bazar & aktivitas keluarga', copy: 'Singgah di stan kuliner, buku Islam, dan produk halal pilihan.' },
  { id: 'Panggung acara', copy: 'Nikmati penampilan dari pengisi acara yang telah diumumkan.' },
  { id: 'Doorprize & penutupan', copy: 'Simak pengumuman hadiah dan informasi penutup dari panitia.' }
] : [
  { id: 'Arrival & registration', copy: 'Arrive early, prepare your digital ticket, and follow signs to the event area.' },
  { id: 'Opening', copy: 'We begin the Santri Day celebration with welcomes and prayers.' },
  { id: 'Activity starts', copy: 'Gather at the start point and follow marshal guidance for your activity.' },
  { id: 'Bazaar & family activities', copy: 'Visit halal food, Islamic books, and selected local products.' },
  { id: 'Stage program', copy: 'Enjoy performances from announced guests and performers.' },
  { id: 'Prize draw & closing', copy: 'Follow the official prize announcement and closing information.' }
]);
const faqItems = computed(() => locale.value === 'id' ? [
  { question: 'Kapan dan di mana acara berlangsung?', answer: 'Minggu, 25 Oktober 2026 di Summarecon Crown Gading, Tarumajaya, Bekasi. Jam dan titik kumpul diumumkan panitia.' },
  { question: 'Dapatkah saya mendaftarkan beberapa anggota keluarga?', answer: 'Ya, mengikuti batas peserta paket. Isi data dan ukuran kaos tiap anggota secara terpisah.' },
  { question: 'Bagaimana memilih ukuran kaos?', answer: 'Pilih ukuran pada formulir setiap peserta. Perubahan setelah pembayaran mengikuti tenggat dan stok panitia.' },
  { question: 'Bagaimana cara membayar?', answer: 'Pilih Lanjutkan Pembayaran untuk diarahkan ke Portal Payment. Status lunas tampil setelah konfirmasi sistem diterima.' },
  { question: 'Kapan tiket terbit?', answer: 'Tiket digital setiap peserta tersedia setelah pembayaran terverifikasi.' },
  { question: 'Bagaimana mendaftar bazar?', answer: 'Kirim pengajuan melalui halaman Daftar Tenant Bazar. Pengajuan tidak otomatis menjamin stan.' }
] : [
  { question: 'When and where is the event?', answer: 'Sunday, 25 October 2026 at Summarecon Crown Gading, Tarumajaya, Bekasi. The organizers will announce the time and gathering point.' },
  { question: 'Can I register several family members?', answer: 'Yes, within the package limit. Enter each member’s details and shirt size separately.' },
  { question: 'How do I choose a shirt size?', answer: 'Choose a size for each participant. Post-payment changes depend on the organizer’s deadline and stock.' },
  { question: 'How do I pay?', answer: 'Continue to Payment to open the separate Payment Portal. Your status changes to paid only after system confirmation.' },
  { question: 'When are tickets issued?', answer: 'Each participant’s digital ticket is available after payment is verified.' },
  { question: 'How do I apply for a bazaar stall?', answer: 'Submit an application through Apply as a Bazaar Tenant. An application does not guarantee a stall.' }
]);
const formatPrice = (price: number, currency: string) => new Intl.NumberFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
  style: 'currency', currency, maximumFractionDigits: 0
}).format(price);

onMounted(async () => {
  try {
    const response = await eventService.getEvents(1, 100);
    const event = response.data.find(item => item.slug === runtime.public.eventSlug);
    if (event) products.value = (await store.getProducts(event.id)).data;
  } catch {
    products.value = [];
  } finally {
    packagesLoading.value = false;
  }
});

useSeoMeta({
  title: () => locale.value === 'id'
    ? 'Hari Santri 2026 | Sepeda Sehat & Jalan Sehat Keluarga'
    : 'Hari Santri 2026 | Healthy Cycling & Family Walk',
  description: () => locale.value === 'id'
    ? 'Ikuti Sepeda Sehat dan Jalan Sehat Keluarga Hari Santri 2026 pada 25 Oktober di Summarecon Crown Gading. Lihat paket, rute, agenda, bazar, dan daftar peserta.'
    : 'Join the Hari Santri 2026 healthy cycling and family walk on 25 October at Summarecon Crown Gading. Explore packages, routes, agenda, bazaar, and registration.'
});
</script>

<style scoped>
.portal-home { color: #17352c; background: #f5f5ef; }
.hero { position: relative; isolation: isolate; display: flex; min-height: min(760px, calc(100svh - 5rem)); align-items: flex-end; overflow: hidden; background: #163a30; color: #fff; }
.hero__image { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 55%; }
.hero__shade { position: absolute; z-index: -1; inset: 0; background: rgba(11, 32, 26, .48); }
.hero__content { width: min(100%, 1280px); margin-inline: auto; padding: 5rem clamp(1.25rem, 6vw, 6rem) 4.5rem; }
.eyebrow,.section-number,.activity__label { font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.hero h1 { max-width: 19ch; margin-top: 1.2rem; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.8rem, 6vw, 6rem); font-weight: 700; line-height: .98; }
.hero__subtitle { margin-top: 1.25rem; font-size: clamp(1.2rem, 2.4vw, 2rem); font-weight: 700; }
.hero__lead { max-width: 42rem; margin-top: .8rem; color: #f2f3e9; font-size: 1rem; line-height: 1.7; }
.hero__facts { display: flex; flex-wrap: wrap; gap: .5rem 1.2rem; margin-top: 1.7rem; color: #f2f3e9; font-size: .84rem; }
.hero__facts span + span::before { content: '·'; margin-inline: 1.2rem; color: #e7c06a; }
.hero__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.5rem; margin-top: 2rem; }
.button { display: inline-flex; min-height: 2.9rem; align-items: center; justify-content: center; padding: .75rem 1.1rem; font-size: .88rem; font-weight: 800; transition: background .18s ease, color .18s ease; }
.button--light { background: #f4d578; color: #17352c; }
.button--light:hover { background: #ffe69b; }
.button--dark { background: #17352c; color: #fff; }
.button--dark:hover { background: #285442; }
.text-link { display: inline-flex; align-items: center; gap: .5rem; color: inherit; font-size: .88rem; font-weight: 800; text-decoration: underline; text-underline-offset: .25rem; }
.hero__index { position: absolute; right: clamp(1rem, 4vw, 4rem); bottom: 1.4rem; font-size: .68rem; font-weight: 800; letter-spacing: .12em; }
.band { padding: clamp(3.5rem, 7vw, 7rem) max(1.25rem, calc((100vw - 1200px) / 2)); }
.band--paper { background: #fff; }
.band--green { background: #173f32; color: #fff; }
.content-grid { display: grid; grid-template-columns: minmax(9rem, .35fr) minmax(0, 1fr); gap: clamp(2rem, 6vw, 6rem); max-width: 1200px; margin: 0 auto; }
.section-heading { max-width: 1200px; margin: 0 auto 2.5rem; }
.section-number { color: #2d7258; }
.section-number span { color: #738278; }
h2,h3,h4 { font-family: Georgia, 'Times New Roman', serif; font-weight: 700; }
.band h2 { max-width: 18ch; margin-top: .8rem; font-size: clamp(2.1rem, 4.3vw, 4rem); line-height: 1.08; }
.lead-copy { max-width: 58rem; margin-top: 1.3rem; color: #52665b; font-size: 1.08rem; line-height: 1.85; }
.event-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.4rem 2rem; margin-top: 2rem; border-top: 1px solid #d9e0d8; padding-top: 1.4rem; }
.event-facts div { display: grid; gap: .3rem; }
.event-facts span,.package-heading p,.small-note { color: #697a70; font-size: .82rem; line-height: 1.65; }
.event-facts strong { font-size: .9rem; line-height: 1.5; }
.section-heading h2 { max-width: 22ch; margin-top: .8rem; font-size: clamp(2.1rem, 4.3vw, 3.5rem); line-height: 1.08; }
.activity-grid,.route-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 1200px; margin: 0 auto; border-top: 1px solid #d9e0d8; }
.activity { display: flex; min-height: 18rem; flex-direction: column; align-items: flex-start; padding: 1.8rem; }
.activity + .activity { border-left: 1px solid #d9e0d8; }
.activity__label { color: #8a6b20; }
.activity h3 { margin-top: 1.1rem; font-size: 2rem; }
.activity p:not(.activity__label) { max-width: 34rem; margin: .8rem 0 1.5rem; color: #596d61; line-height: 1.7; }
.activity .text-link { margin-top: auto; }
.package-heading { display: flex; max-width: 1200px; align-items: end; justify-content: space-between; gap: 2rem; margin: 3rem auto 1rem; }
.package-heading h3 { margin-top: .6rem; font-size: 1.8rem; }
.package-heading p { max-width: 26rem; }
.package-list { max-width: 1200px; margin: 0 auto; border-top: 1px solid #d9e0d8; }
.package-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 1.5rem; border-bottom: 1px solid #d9e0d8; padding: 1.25rem 0; }
.package-row h4 { font-size: 1.35rem; }
.package-row p { margin-top: .4rem; color: #697a70; font-size: .84rem; }
.package-row__price { font-weight: 800; white-space: nowrap; }
.package-state { max-width: 1200px; margin: 0 auto; border-block: 1px solid #d9e0d8; padding: 1.4rem 0; color: #596d61; }
.package-state .text-link { margin-top: .8rem; }
.small-note { max-width: 1200px; margin: 1rem auto 0; }
.route-grid article { padding: 1.5rem 1.8rem; }
.route-grid article + article { border-left: 1px solid #d9e0d8; }
.route-grid span { color: #8a6b20; font-size: .68rem; font-weight: 800; letter-spacing: .12em; }
.route-grid h3 { margin-top: .8rem; font-size: 1.8rem; }
.route-grid p,.history p { margin-top: .8rem; color: #596d61; line-height: 1.75; }
.safety-note { max-width: 1200px; margin: 1.5rem auto 0; border-left: 3px solid #d4a938; padding-left: 1rem; color: #596d61; font-size: .9rem; }
.agenda-list { margin-top: 1.5rem; border-top: 1px solid #d9e0d8; list-style: none; }
.agenda-list li { display: grid; grid-template-columns: 2rem minmax(10rem, .7fr) minmax(0, 1.2fr) auto; align-items: baseline; gap: 1rem; border-bottom: 1px solid #d9e0d8; padding: 1rem 0; }
.agenda-list li > span { color: #2d7258; font-size: .72rem; font-weight: 800; }
.agenda-list strong { font-size: .95rem; }
.agenda-list p { color: #596d61; font-size: .86rem; line-height: 1.55; }
.agenda-list em { color: #8a6b20; font-size: .72rem; font-style: normal; }
.performer-empty,.prize-empty { margin-top: 2rem; border-block: 1px solid #d9e0d8; padding: 1.2rem 0; color: #738278; font-weight: 700; }
.prizes .section-number,.prizes .section-number span { color: #dbe9dc; }
.prizes .lead-copy { color: #dbe9dc; }
.prizes .prize-empty { border-color: rgb(255 255 255 / 24%); color: #e6d18b; }
.history__sources { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.4rem; }
.history__sources a { color: #2d7258; font-size: .82rem; font-weight: 700; text-decoration: underline; text-underline-offset: .2rem; }
.faq-item { border-bottom: 1px solid #d9e0d8; padding: 1rem 0; }
.faq-item:first-of-type { margin-top: 1.2rem; border-top: 1px solid #d9e0d8; }
.faq-item summary { cursor: pointer; font-size: .98rem; font-weight: 800; }
.faq-item p { margin-top: .75rem; color: #596d61; line-height: 1.7; }
.faq .button { margin-top: 1.8rem; }
@media (max-width: 760px) {
  .hero { min-height: 68svh; }
  .hero__content { padding-top: 7rem; padding-bottom: 4rem; }
  .hero__facts { display: grid; gap: .45rem; }
  .hero__facts span + span::before { content: none; }
  .content-grid { grid-template-columns: 1fr; gap: 1.4rem; }
  .activity-grid,.route-grid { grid-template-columns: 1fr; }
  .activity + .activity,.route-grid article + article { border-left: 0; border-top: 1px solid #d9e0d8; }
  .package-heading { display: block; }
  .package-heading p { margin-top: .6rem; }
  .package-row { grid-template-columns: minmax(0, 1fr) auto; gap: .8rem; }
  .package-row .button { grid-column: 1 / -1; }
  .agenda-list li { grid-template-columns: 2rem minmax(0, 1fr); gap: .4rem .8rem; }
  .agenda-list p,.agenda-list em { grid-column: 2; }
}
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { scroll-behavior: auto !important; transition-duration: .01ms !important; } }
</style>
