<template>
  <div class="portal-home">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__content">
        <p class="hero__eyebrow">{{ locale === 'id' ? 'HARLAH NU KE-101 · HARI LAHIR NAHDLATUL ULAMA · 31 JANUARI 2027' : 'NU’S 101ST ANNIVERSARY · 31 JANUARY 2027' }}</p>
        <h1 id="hero-title">{{ locale === 'id' ? 'Dari Pesantren untuk Negeri' : 'From Pesantren for the Nation' }}</h1>
        <p class="hero__lead">{{ locale === 'id' ? 'Sepeda Santai & Jalan Sehat Keluarga. Silaturahmi akbar warga Tarumajaya di Summarecon Crown Gading.' : 'Leisure cycling and a family walk. A great gathering for Tarumajaya residents at Summarecon Crown Gading.' }}</p>
        <div class="hero__actions">
          <NuxtLink to="/daftar" class="button button--gold">{{ locale === 'id' ? 'Daftar Peserta' : 'Register Participants' }}</NuxtLink>
          <NuxtLink to="/sejarah-nu" class="button button--outline">{{ locale === 'id' ? 'Baca Sejarahnya' : 'Read Our History' }}</NuxtLink>
        </div>
      </div>
      <div class="hero__visual">
        <div class="hero__visual-frame">
          <img
            class="hero__image"
            :src="heroImage"
            alt="Peserta Sepeda Santai dan Jalan Sehat Keluarga dalam perayaan Harlah NU ke-101"
            fetchpriority="high"
            width="2400"
            height="1500"
          >
          <div class="hero__anniversary" :aria-label="locale === 'id' ? '101 tahun khidmah Nahdlatul Ulama' : '101 years of Nahdlatul Ulama service'">
            <span class="hero__anniversary-number">101</span>
            <span class="hero__anniversary-copy">{{ locale === 'id' ? 'TAHUN KHIDMAH' : 'YEARS OF SERVICE' }}<small>1926 — 2027</small></span>
          </div>
        </div>
        <p class="hero__index" aria-hidden="true">01 / 31.01.27</p>
      </div>
    </section>

    <section id="tentang" class="intro band">
      <div class="content-grid">
        <p class="section-number">01 <span>/ {{ locale === 'id' ? 'Tentang Acara' : 'About' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Merayakan 101 tahun khidmah dengan gerak dan kebersamaan.' : 'Celebrating 101 years of service through movement and togetherness.' }}</h2>
          <p class="lead-copy">{{ locale === 'id' ? 'Harlah NU menjadi ruang silaturahmi keluarga dan warga Tarumajaya untuk menikmati Sepeda Santai dan Jalan Sehat Keluarga di kawasan Summarecon Crown Gading. Rayakan kebersamaan, dukung bazar lokal, dan teruskan semangat pesantren untuk negeri.' : 'Harlah NU brings families and neighbors together for a leisure cycling event and family walk at Summarecon Crown Gading. Celebrate together, support local vendors, and carry the pesantren spirit forward.' }}</p>
          <div class="event-facts">
            <div><span>{{ locale === 'id' ? 'Penyelenggara' : 'Organizer' }}</span><strong>MWC NU Tarumajaya</strong></div>
            <div><span>{{ locale === 'id' ? 'Tanggal' : 'Date' }}</span><strong>{{ locale === 'id' ? 'Minggu, 31 Januari 2027' : 'Sunday, 31 January 2027' }}</strong></div>
            <div><span>{{ locale === 'id' ? 'Lokasi' : 'Venue' }}</span><strong>Summarecon Crown Gading, Tarumajaya, Bekasi</strong></div>
            <div><span>{{ locale === 'id' ? 'Waktu & titik kumpul' : 'Time & gathering point' }}</span><strong>{{ locale === 'id' ? 'Diumumkan panitia' : 'To be announced' }}</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section id="kegiatan" class="activities band band--paper">
      <div class="section-heading">
        <p class="section-number">02 <span>/ {{ locale === 'id' ? 'Kegiatan' : 'Activities' }}</span></p>
        <h2>{{ locale === 'id' ? 'Pilih langkahmu untuk Harlah NU ke-101.' : 'Choose your way to celebrate Harlah NU 101.' }}</h2>
      </div>
      <div class="activity-grid">
        <article class="activity activity--cycle">
          <p class="activity__label">01 / CYCLING</p>
          <h3>{{ locale === 'id' ? 'Sepeda Santai' : 'Leisure Bike Ride' }}</h3>
          <p>{{ locale === 'id' ? 'Kayuh bersama keluarga dan sahabat di dalam kawasan Summarecon Crown Gading. Ketentuan peserta dan jenis kegiatan resmi tersedia sebelum mendaftar.' : 'Ride with family and friends within Summarecon Crown Gading. Participant terms and official activity types are available before registration.' }}</p>
          <a href="#syarat-ketentuan" class="text-link">{{ locale === 'id' ? 'Baca syarat & ketentuan' : 'Read terms & conditions' }} <span aria-hidden="true">→</span></a>
        </article>
        <article class="activity activity--walk">
          <p class="activity__label">02 / FAMILY WALK</p>
          <h3>{{ locale === 'id' ? 'Jalan Sehat Keluarga' : 'Family Walk' }}</h3>
          <p>{{ locale === 'id' ? 'Ajak orang tua, anak, dan sahabat berjalan bersama. Setiap anggota keluarga didaftarkan dengan data dan ukuran kaos masing-masing.' : 'Bring parents, children, and friends for a relaxed walk. Register each family member with their own details and shirt size.' }}</p>
          <a href="#syarat-ketentuan" class="text-link">{{ locale === 'id' ? 'Baca syarat & ketentuan' : 'Read terms & conditions' }} <span aria-hidden="true">→</span></a>
        </article>
      </div>

      <div class="package-heading">
        <div>
          <p class="section-number">{{ locale === 'id' ? 'JENIS KEGIATAN PESERTA' : 'PARTICIPANT ACTIVITIES' }}</p>
          <h3>{{ locale === 'id' ? 'Biaya pendaftaran dan kuota resmi' : 'Official registration fees and availability' }}</h3>
        </div>
        <p>{{ locale === 'id' ? 'Biaya pendaftaran, manfaat, periode, dan kuota ditentukan panitia dan dimuat dari server.' : 'Registration fees, inclusions, sales period, and capacity are managed by the organizers and loaded from the server.' }}</p>
      </div>
      <p v-if="packagesLoading" class="package-state">{{ locale === 'id' ? 'Memuat jenis kegiatan…' : 'Loading activity types…' }}</p>
      <div v-else-if="products.length" class="package-list">
        <article v-for="item in products" :key="item.id" class="package-row">
          <img class="package-row__image" :src="packageImage(item)" :alt="item.name" loading="lazy" decoding="async">
          <div><h4>{{ item.name }}</h4><p>{{ item.description || (locale === 'id' ? 'Rincian jenis kegiatan mengikuti pengumuman resmi panitia.' : 'Activity details will follow the organizers’ official announcement.') }}</p></div>
          <div class="package-row__price">{{ formatPrice(Number(item.price ?? item.amount ?? 0), item.currency) }}</div>
          <NuxtLink to="/daftar" class="button button--dark">{{ locale === 'id' ? 'Pilih Jenis Kegiatan' : 'Select Activity' }}</NuxtLink>
        </article>
      </div>
      <div v-else class="package-state">
        <p>{{ locale === 'id' ? 'Jenis kegiatan resmi, biaya pendaftaran, isi, dan kuota akan diumumkan panitia.' : 'Official activity types, registration fees, inclusions, and capacity will be announced by the organizers.' }}</p>
        <NuxtLink to="/daftar" class="text-link">{{ locale === 'id' ? 'Lihat formulir pendaftaran' : 'Open registration' }} <span aria-hidden="true">→</span></NuxtLink>
      </div>
      <p class="small-note">{{ locale === 'id' ? 'Setiap peserta memilih ukuran kaos secara terpisah. Biaya pendaftaran yang berlaku adalah biaya pada ringkasan pesanan sebelum pembayaran.' : 'Each participant selects a shirt size separately. The registration fee shown in the server-side order summary is final.' }}</p>
    </section>

    <section id="syarat-ketentuan" class="terms band">
      <div class="content-grid">
        <p class="section-number">03 <span>/ {{ locale === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Syarat & Ketentuan Peserta Sepeda Santai dan Jalan Sehat Keluarga' : 'Terms & Conditions for Leisure Cycling and Family Walk Participants' }}</h2>
          <p class="terms__intro">{{ locale === 'id' ? 'Mari meriahkan rangkaian acara di Summarecon Crown Gading, Bekasi. Kegiatan Sepeda Santai dan Jalan Sehat Keluarga berlangsung di dalam kawasan Summarecon Crown Gading. Pastikan Anda menyimak ketentuan berikut sebelum mendaftar.' : 'Join the celebration at Summarecon Crown Gading, Bekasi. The Leisure Cycling and Family Walk activities take place within the Summarecon Crown Gading area. Please read these terms before registering.' }}</p>
          <div class="terms__group">
            <h3>{{ locale === 'id' ? 'Pendaftaran & keikutsertaan' : 'Registration & participation' }}</h3>
            <ol class="terms__list">
              <li v-for="(item, index) in termsRegistrationItems" :key="item.title"><span>0{{ index + 1 }}</span><div><h4>{{ item.title }}</h4><p>{{ item.copy }}</p></div></li>
            </ol>
          </div>
          <div class="terms__group">
            <h3>{{ locale === 'id' ? 'Aktivitas, checkpoint, fasilitas & hadiah' : 'Activity, checkpoints, benefits & prizes' }}</h3>
            <ol class="terms__list">
              <li v-for="(item, index) in termsActivityItems" :key="item.title"><span>0{{ index + 1 }}</span><div><h4>{{ item.title }}</h4><p>{{ item.copy }}</p></div></li>
            </ol>
          </div>
          <p class="terms__closing">{{ locale === 'id' ? 'Ikuti terus informasi dan pembaruan acara melalui situs web resmi harlahnu.com.' : 'Follow event news and updates through the official harlahnu.com website.' }}</p>
        </div>
      </div>
    </section>

    <section id="agenda" class="agenda band band--paper">
      <div class="content-grid">
        <p class="section-number">04 <span>/ {{ locale === 'id' ? 'Agenda' : 'Agenda' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Satu hari, banyak momen bersama.' : 'One day, many moments together.' }}</h2>
          <p class="small-note">{{ locale === 'id' ? 'Berikut susunan waktu acara. Peserta diharapkan hadir tepat waktu dan mengikuti arahan panitia.' : 'Here is the event schedule. Participants are encouraged to arrive on time and follow the organizers’ guidance.' }}</p>
          <ol class="agenda-list">
            <li v-for="(item, index) in agendaItems" :key="item.id"><span>0{{ index + 1 }}</span><strong>{{ item.id }}</strong><p>{{ item.copy }}</p><em>{{ item.time }}</em></li>
          </ol>
        </div>
      </div>
    </section>

    <section id="pengisi-acara" class="performers band">
      <div class="section-heading">
        <p class="section-number">05 <span>/ {{ locale === 'id' ? 'Pengisi Acara' : 'Performers' }}</span></p>
        <h2>{{ locale === 'id' ? 'Bertemu di panggung Harlah NU.' : 'Meet us at the Harlah NU stage.' }}</h2>
      </div>
      <p class="lead-copy">{{ locale === 'id' ? 'Sholawat, pesan kebersamaan, penampilan komunitas, dan hiburan keluarga akan diumumkan setelah kehadiran pengisi acara dikonfirmasi.' : 'Sholawat, messages of togetherness, community performances, and family entertainment will be announced when confirmed.' }}</p>
      <figure class="performer-showcase">
        <img :src="stageImage" alt="Ilustrasi panggung hiburan Harlah NU dengan pertunjukan seni dan penonton" loading="lazy">
        <figcaption>{{ locale === 'id' ? 'Panggung hiburan, seni budaya, sholawat, dan kebersamaan warga NU.' : 'Live entertainment, cultural arts, sholawat, and NU community togetherness.' }}</figcaption>
      </figure>
    </section>

    <section id="hadiah" class="prizes band band--green">
      <div class="content-grid">
        <p class="section-number">06 <span>/ {{ locale === 'id' ? 'Hadiah' : 'Prizes' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Kejutan menyenangkan sepanjang acara.' : 'A little excitement throughout the day.' }}</h2>
          <p class="lead-copy">{{ locale === 'id' ? 'Banyak hadiah menarik yang bisa diperebutkan peserta dan keluarga. Siapkan semangat, ikuti rangkaian acara, dan jangan lewatkan doorprize.' : 'Many exciting prizes are available for participants and families. Bring your spirit, enjoy the activities, and do not miss the lucky draws.' }}</p>
          <div class="prize-showcase">
            <img :src="prizeImage" alt="Beragam hadiah Harlah NU berupa sepeda, sepeda listrik, piala, perlengkapan rumah, dan doorprize" loading="lazy">
            <div class="prize-showcase__copy">
              <p class="prize-showcase__label">{{ locale === 'id' ? 'Hadiah utama & doorprize' : 'Main prizes & lucky draws' }}</p>
              <ul class="prize-list">
                <li v-for="prize in prizeCategories" :key="prize.id">{{ locale === 'id' ? prize.id : prize.en }}</li>
              </ul>
            </div>
          </div>
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
        <p class="section-number">08 <span>/ {{ locale === 'id' ? 'Sejarah NU & Hari Santri' : 'NU & Santri History' }}</span></p>
        <div>
          <h2>{{ locale === 'id' ? 'Pesantren, rahim yang melahirkan Nahdlatul Ulama.' : 'The santri spirit in Indonesia’s story.' }}</h2>
          <p class="history__intro">{{ locale === 'id' ? 'Nahdlatul Ulama berdiri di Surabaya pada 31 Januari 1926, bertepatan dengan 16 Rajab 1344 H. Harlah NU mengingatkan kita pada perjalanan pesantren, ulama, dan warga dalam merawat ilmu, persaudaraan, serta pengabdian untuk negeri.' : 'Nahdlatul Ulama was founded in Surabaya on 31 January 1926, corresponding to 16 Rajab 1344 H. Harlah NU recalls the journey of pesantren, ulama, and communities in serving knowledge, solidarity, and the nation.' }}</p>
          <div class="history__stories">
            <article v-for="story in historyItems" :key="story.title" class="history-story">
              <figure class="history-story__figure">
                <img :src="story.image" :alt="story.alt" loading="lazy" decoding="async">
                <figcaption>{{ locale === 'id' ? 'Ilustrasi sejarah, bukan foto dokumentasi peristiwa.' : 'Historical illustration, not a documentary photograph.' }}</figcaption>
              </figure>
              <div class="history-story__body">
                <p class="history-story__date">{{ story.date }}</p>
                <h3>{{ story.title }}</h3>
                <p class="history-story__copy">{{ story.copy }}</p>
                <NuxtLink v-if="story.href" :to="story.href" class="history-story__link">
                  {{ locale === 'id' ? 'Baca artikel' : 'Read article' }} →
                </NuxtLink>
              </div>
            </article>
          </div>
          <div class="history-anniversary" :aria-label="locale === 'id' ? 'Harlah NU menurut dua sistem penanggalan' : 'NU anniversary in two calendar systems'">
            <div class="history-anniversary__heading">
              <p class="history-anniversary__eyebrow">{{ locale === 'id' ? 'DUA PENANGGALAN, SATU HIKMAH' : 'TWO CALENDARS, ONE LEGACY' }}</p>
              <p>{{ locale === 'id' ? 'Usia Harlah berbeda menurut kalender yang digunakan.' : 'The anniversary count differs by calendar.' }}</p>
            </div>
            <div class="history-anniversary__dates">
              <article class="history-anniversary__date">
                <p class="history-anniversary__calendar">{{ locale === 'id' ? 'Kalender Hijriah' : 'Hijri calendar' }}</p>
                <p class="history-anniversary__number">104<sup>{{ locale === 'id' ? 'ke' : 'th' }}</sup></p>
                <p class="history-anniversary__title">{{ locale === 'id' ? 'Harlah NU' : 'NU anniversary' }}</p>
                <p class="history-anniversary__day">16 Rajab 1448 H</p>
                <p class="history-anniversary__equivalent">{{ locale === 'id' ? '25–26 Desember 2026' : '25–26 December 2026' }}</p>
              </article>
              <article class="history-anniversary__date">
                <p class="history-anniversary__calendar">{{ locale === 'id' ? 'Kalender Masehi' : 'Gregorian calendar' }}</p>
                <p class="history-anniversary__number">101<sup>{{ locale === 'id' ? 'ke' : 'st' }}</sup></p>
                <p class="history-anniversary__title">{{ locale === 'id' ? 'Harlah NU' : 'NU anniversary' }}</p>
                <p class="history-anniversary__day">{{ locale === 'id' ? '31 Januari 2027' : '31 January 2027' }}</p>
                <p class="history-anniversary__equivalent">1926–2027</p>
              </article>
            </div>
          </div>
          <NuxtLink to="/sejarah-nu" class="button button--dark">{{ locale === 'id' ? 'Baca Sejarah NU Selengkapnya' : 'Read the Full NU History' }}</NuxtLink>
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
import heroImage from '~/assets/images/hero_harlah_nu_101.png';
import perangDaerahImage from '~/assets/images/perang daerah.jpg';
import pertempuranSurabayaImage from '~/assets/images/pertempuran-surabaya.png';
import resolusiJihadImage from '~/assets/images/resolusi jihad.jpg';
import santriDanUlamaImage from '~/assets/images/santri dan ulama.jpg';
import cyclingShirtImage from '~/assets/images/kaos-sepeda-santai.png';
import familyWalkShirtImage from '~/assets/images/kaos-jalan-sehat.png';
import prizeImage from '~/assets/images/hadiah-harlah-nu.png';
import stageImage from '~/assets/images/panggung-harlah-nu.png';
import type { StoreProduct } from '~/composables/useStore';

const { locale } = useI18n();
const runtime = useRuntimeConfig();
const products = ref<StoreProduct[]>([]);
const packagesLoading = ref(true);
const eventService = useEvent();
const store = useStore();

const historyItems = computed(() => locale.value === 'id' ? [
  {
    date: '22 Oktober 1945',
    title: 'Resolusi Jihad: seruan menjaga kemerdekaan',
    image: resolusiJihadImage,
    alt: 'Ilustrasi pertemuan ulama dan santri pada masa perjuangan kemerdekaan',
    href: '/resolusi-jihad',
    copy: 'Setelah Proklamasi 17 Agustus 1945, kedatangan Sekutu yang disertai NICA membuat keadaan di Indonesia kembali genting. Pada 21–22 Oktober 1945, para ulama dan wakil cabang NU bermusyawarah di Surabaya. Resolusi Jihad yang diserukan pada 22 Oktober mengajak umat dan masyarakat untuk mempertahankan kemerdekaan.'
  },
  {
    date: '10 November 1945',
    title: 'Pertempuran Surabaya',
    image: pertempuranSurabayaImage,
    alt: 'Ilustrasi pejuang Surabaya pada November 1945',
    href: '/pertempuran-surabaya',
    copy: 'Ketegangan meningkat setelah Brigadir Jenderal A.W.S. Mallaby tewas dalam insiden pada 30 Oktober. Ultimatum Sekutu agar rakyat menyerahkan senjata ditolak, lalu pertempuran besar pecah pada 10 November. Bung Tomo mengobarkan semangat melalui siaran radio, sementara Gubernur Suryo menegaskan sikap rakyat Surabaya.'
  },
  {
    date: '1945 dan sesudahnya',
    title: 'Perjuangan berlanjut di berbagai daerah',
    image: santriDanUlamaImage,
    alt: 'Ilustrasi perjuangan rakyat di berbagai daerah untuk mempertahankan kemerdekaan',
    href: '/perjuangan-kemerdekaan',
    copy: 'Perlawanan mempertahankan kemerdekaan juga berlangsung di Palagan Ambarawa, Medan Area, dan Bandung. Perjuangan berlanjut menghadapi Agresi Militer Belanda I dan II. Di tengah peristiwa-peristiwa itu, jalur diplomasi dan perjuangan rakyat sama-sama menjadi bagian dari upaya menjaga kedaulatan.'
  },
  {
    date: 'Sebelum 17 Agustus 1945',
    title: 'Jejak perlawanan di Nusantara',
    image: perangDaerahImage,
    alt: 'Ilustrasi perlawanan masyarakat Nusantara terhadap kolonialisme',
    href: '/divide-et-impera',
    copy: 'Jauh sebelum kemerdekaan diproklamasikan, masyarakat di berbagai wilayah Nusantara telah menghadapi kolonialisme dan berjuang menjaga kedaulatan. Jejak panjang perlawanan itu menjadi bagian dari sejarah bangsa yang kemudian diteruskan dalam perjuangan mempertahankan kemerdekaan.'
  }
] : [
  {
    date: '22 October 1945',
    title: 'The Resolution of Jihad: a call to defend independence',
    image: resolusiJihadImage,
    alt: 'Illustration of ulama and santri meeting during the struggle for independence',
    href: '/resolusi-jihad',
    copy: 'After the Proclamation of 17 August 1945, the arrival of Allied forces accompanied by the NICA made the situation tense again. On 21–22 October 1945, ulama and NU branch representatives met in Surabaya. The Resolution of Jihad, proclaimed on 22 October, called on the community to defend independence.'
  },
  {
    date: '10 November 1945',
    title: 'The Battle of Surabaya',
    image: pertempuranSurabayaImage,
    alt: 'Illustration of Surabaya fighters in November 1945',
    href: '/pertempuran-surabaya',
    copy: 'Tensions escalated after Brigadier General A.W.S. Mallaby was killed in an incident on 30 October. The Allied ultimatum demanding that residents surrender their weapons was rejected, and a major battle broke out on 10 November. Bung Tomo rallied people through radio broadcasts, while Governor Suryo voiced the people of Surabaya’s resolve.'
  },
  {
    date: '1945 and after',
    title: 'The struggle continued across the archipelago',
    image: santriDanUlamaImage,
    alt: 'Illustration of people across the archipelago defending independence',
    href: '/perjuangan-kemerdekaan',
    copy: 'The struggle to defend independence also took place at Ambarawa, Medan Area, and Bandung. It continued through the First and Second Dutch Military Aggressions. Throughout these events, diplomacy and popular resistance both formed part of the effort to safeguard sovereignty.'
  },
  {
    date: 'Before 17 August 1945',
    title: 'A legacy of resistance across the archipelago',
    image: perangDaerahImage,
    alt: 'Illustration of people across the archipelago resisting colonialism',
    href: '/divide-et-impera',
    copy: 'Long before independence was proclaimed, people in many parts of the archipelago faced colonialism and fought to protect their sovereignty. This long history of resistance became part of the national story carried forward in the struggle to defend independence.'
  }
]);

const termsRegistrationItems = computed(() => locale.value === 'id' ? [
  { title: 'Pendaftaran resmi', copy: 'Seluruh peserta wajib mendaftarkan diri melalui situs web resmi harlahnu.com.' },
  { title: 'Data registrasi', copy: 'Gunakan alamat email dan nomor HP yang aktif saat melakukan registrasi.' },
  { title: 'Pilihan jenis kegiatan', copy: 'Saat mendaftar, pilih salah satu jenis kegiatan yang tersedia: Sepeda Santai atau Jalan Sehat Keluarga.' },
  { title: 'Kategori peserta', copy: 'Keikutsertaan diutamakan bersama pasangan dan keluarga untuk memupuk semangat kebersamaan.' },
  { title: 'Kehadiran hari-H', copy: 'Peserta wajib hadir pada hari pelaksanaan dan melakukan absensi kedatangan menggunakan Tanda Peserta.' }
] : [
  { title: 'Official registration', copy: 'All participants must register through the official harlahnu.com website.' },
  { title: 'Registration details', copy: 'Use an active email address and mobile phone number when registering.' },
  { title: 'Choose an activity type', copy: 'Select one of the available activity types when registering: Leisure Cycling or Family Walk.' },
  { title: 'Participant category', copy: 'Participation with a partner and family is encouraged to foster togetherness.' },
  { title: 'Event-day attendance', copy: 'Participants must attend on event day and record their arrival using their Participant Pass.' }
]);
const termsActivityItems = computed(() => locale.value === 'id' ? [
  { title: 'Aktivitas di kawasan acara', copy: 'Peserta Sepeda Santai dan Jalan Sehat akan berkeliling menikmati suasana di dalam kawasan Summarecon Crown Gading.' },
  { title: 'Sistem checkpoint', copy: 'Peserta wajib mengisi checkpoint selama mengikuti kegiatan. Hadiah hiburan disediakan bagi keluarga yang aktif mengikuti seluruh rangkaian aktivitas.' },
  { title: 'Doorprize & voucher UMKM', copy: 'Peserta yang hadir berhak mengikuti kesempatan memenangkan doorprize. Penukaran doorprize dan penggunaan voucher belanja di booth UMKM dapat dilakukan menggunakan QR Code yang tertera di web.' },
  { title: 'Keluarga Favorit', copy: 'Panitia akan memilih tiga Keluarga Paling Favorit untuk menerima hadiah spesial.' }
] : [
  { title: 'Activities within the event area', copy: 'Leisure Cycling and Family Walk participants will explore the surroundings within Summarecon Crown Gading.' },
  { title: 'Checkpoint system', copy: 'Participants must check in at checkpoints throughout the activity. Entertainment prizes are available for families who actively complete all activities.' },
  { title: 'Door prizes & MSME vouchers', copy: 'Attending participants are eligible for a chance to win door prizes. Door prizes and shopping vouchers at event MSME booths can be redeemed using the QR Code shown on the website.' },
  { title: 'Favorite Families', copy: 'The organizers will select three Favorite Families to receive special prizes.' }
]);
const prizeCategories = [
  { id: 'Keluarga Sehat Favorite', en: 'Favorite Healthy Family' },
  { id: 'Keluarga Ceria', en: 'Cheerful Family' },
  { id: 'Keluarga Sehat', en: 'Healthy Family' },
  { id: 'Keluarga Aktif', en: 'Active Family' },
  { id: 'Goweser Aktif', en: 'Active Cyclist' },
  { id: 'Goweser Ceria', en: 'Cheerful Cyclist' },
  { id: 'Banyak Doorprize Menarik', en: 'Many Exciting Lucky Draws' }
];

const agendaItems = computed(() => locale.value === 'id' ? [
  { id: 'Kedatangan & Registrasi Ulang', time: '05:00 - 05:45', copy: 'Datang lebih awal, siapkan tiket digital, dan ikuti petunjuk menuju area acara.' },
  { id: 'Pembukaan', time: '05:45', copy: 'Kita awali perayaan Harlah NU dengan sambutan dan doa bersama.' },
  { id: 'Pelepasan Kegiatan', time: '06:00', copy: 'Bersiap di titik start dan ikuti arahan petugas untuk kegiatan pilihanmu.' },
  { id: 'Bazar dan Aktivitas Keluarga', time: '06:00 - 08:00', copy: 'Singgah di stan kuliner, buku Islam, dan produk halal pilihan.' },
  { id: 'Panggung Acara', time: '08:00 - 10:00', copy: 'Nikmati penampilan dari pengisi acara yang telah diumumkan.' },
  { id: 'Doorprize, Pembagian Hadiah dan Penutupan', time: '10:00 - 11:00', copy: 'Simak pengumuman hadiah dan informasi penutup dari panitia.' }
] : [
  { id: 'Arrival & re-registration', time: '05:00 - 05:45', copy: 'Arrive early, prepare your digital ticket, and follow signs to the event area.' },
  { id: 'Opening', time: '05:45', copy: 'We begin the Harlah NU celebration with welcomes and prayers.' },
  { id: 'Activity start', time: '06:00', copy: 'Gather at the start point and follow marshal guidance for your activity.' },
  { id: 'Bazaar and family activities', time: '06:00 - 08:00', copy: 'Visit halal food, Islamic books, and selected local products.' },
  { id: 'Stage program', time: '08:00 - 10:00', copy: 'Enjoy performances from announced guests and performers.' },
  { id: 'Lucky draw, prize distribution and closing', time: '10:00 - 11:00', copy: 'Follow the official prize announcement and closing information.' }
]);
const faqItems = computed(() => locale.value === 'id' ? [
  { question: 'Kapan dan di mana acara berlangsung?', answer: 'Minggu, 31 Januari 2027 di Summarecon Crown Gading, Tarumajaya, Bekasi. Jam dan titik kumpul diumumkan panitia.' },
  { question: 'Dapatkah saya mendaftarkan beberapa anggota keluarga?', answer: 'Ya, mengikuti batas peserta pada jenis kegiatan. Isi data dan ukuran kaos tiap anggota secara terpisah.' },
  { question: 'Bagaimana memilih ukuran kaos?', answer: 'Pilih ukuran pada formulir setiap peserta. Perubahan setelah pembayaran mengikuti tenggat dan stok panitia.' },
  { question: 'Bagaimana cara membayar?', answer: 'Pilih Lanjutkan Pembayaran untuk diarahkan ke Portal Payment. Status lunas tampil setelah konfirmasi sistem diterima.' },
  { question: 'Kapan tiket terbit?', answer: 'Tiket digital setiap peserta tersedia setelah pembayaran terverifikasi.' },
  { question: 'Bagaimana mendaftar bazar?', answer: 'Kirim pengajuan melalui halaman Daftar Tenant Bazar. Pengajuan tidak otomatis menjamin stan.' }
] : [
  { question: 'When and where is the event?', answer: 'Sunday, 31 January 2027 at Summarecon Crown Gading, Tarumajaya, Bekasi. The organizers will announce the time and gathering point.' },
  { question: 'Can I register several family members?', answer: 'Yes, within the package limit. Enter each member’s details and shirt size separately.' },
  { question: 'How do I choose a shirt size?', answer: 'Choose a size for each participant. Post-payment changes depend on the organizer’s deadline and stock.' },
  { question: 'How do I pay?', answer: 'Continue to Payment to open the separate Payment Portal. Your status changes to paid only after system confirmation.' },
  { question: 'When are tickets issued?', answer: 'Each participant’s digital ticket is available after payment is verified.' },
  { question: 'How do I apply for a bazaar stall?', answer: 'Submit an application through Apply as a Bazaar Tenant. An application does not guarantee a stall.' }
]);
const formatPrice = (price: number, currency: string) => new Intl.NumberFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
  style: 'currency', currency, maximumFractionDigits: 0
}).format(price);
const packageImage = (product: StoreProduct) => product.metadata_json?.activity_type === 'CYCLING' ? cyclingShirtImage : familyWalkShirtImage;

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
    ? 'Harlah NU ke-101 | Sepeda Santai & Jalan Sehat Keluarga'
    : 'Harlah NU ke-101 | Leisure Bike Ride & Family Fun Walk',
  description: () => locale.value === 'id'
    ? 'Ikuti Sepeda Santai dan Jalan Sehat Keluarga Harlah NU ke-101 pada 31 Januari 2027 di Summarecon Crown Gading. Lihat jenis kegiatan, syarat dan ketentuan, agenda, bazar, dan daftar peserta.'
    : 'Join the Harlah NU ke-101 leisure cycling and family walk on 31 January 2027 at Summarecon Crown Gading. Explore activity types, terms, agenda, bazaar, and registration.'
});
</script>

<style scoped>
.portal-home { color: #0a4a28; background: #f1f7ee; }
.hero { position: relative; isolation: isolate; display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); align-items: center; gap: clamp(2rem, 6vw, 6rem); min-height: min(640px, calc(100svh - 5rem)); overflow: hidden; padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 8vw, 8rem); background: #0a4a28; color: #fff; }
.hero::before { position: absolute; z-index: -1; inset: 0; background: radial-gradient(circle at 85% 15%, rgb(125 191 69 / 18%), transparent 32%), radial-gradient(circle at 20% 100%, rgb(242 176 30 / 12%), transparent 30%); content: ''; }
.hero__content { width: auto; max-width: 34rem; margin: 0; padding: 0; }
.hero__eyebrow { color: #f2b01e; font-size: .72rem; font-weight: 800; letter-spacing: .12em; line-height: 1.5; text-transform: uppercase; }
.eyebrow,.section-number,.activity__label { font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.hero h1 { max-width: 10ch; margin: 1.5rem 0 1.35rem; font-family: 'Lora', Georgia, 'Times New Roman', serif; font-size: clamp(3.1rem, 5.8vw, 5.7rem); font-weight: 700; line-height: .98; }
.hero__lead { max-width: 34rem; color: #d6ebd0; font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.65; }
.hero__facts { display: flex; flex-wrap: wrap; gap: .5rem 1.2rem; margin-top: 1.7rem; color: #d6ebd0; font-size: .84rem; }
.hero__facts span + span::before { content: '·'; margin-inline: 1.2rem; color: #f2b01e; }
.hero__actions { display: flex; flex-wrap: wrap; align-items: center; gap: .85rem; margin-top: 2.2rem; }
.button { display: inline-flex; min-height: 2.9rem; align-items: center; justify-content: center; padding: .75rem 1.1rem; font-size: .88rem; font-weight: 800; transition: background .18s ease, color .18s ease, border-color .18s ease; }
.button--gold { border: 1px solid #f2b01e; background: #f2b01e; color: #12261a; }
.button--gold:hover { background: #7dbf45; border-color: #7dbf45; }
.button--outline { border: 1px solid #7dbf45; background: transparent; color: #fff; }
.button--outline:hover { background: rgb(125 191 69 / 18%); border-color: #7dbf45; }
.button--light { background: #f2b01e; color: #12261a; }
.button--light:hover { background: #7dbf45; }
.button--dark { background: #0a4a28; color: #fff; }
.button--dark:hover { background: #13803e; }
.text-link { display: inline-flex; align-items: center; gap: .5rem; color: inherit; font-size: .88rem; font-weight: 800; text-decoration: underline; text-underline-offset: .25rem; }
.hero__visual { position: relative; min-width: 0; }
.hero__visual-frame { position: relative; overflow: hidden; aspect-ratio: 1.8 / 1; border: 1px solid rgba(255, 255, 255, .14); border-radius: 1.5rem; box-shadow: 0 20px 50px rgba(0, 0, 0, .22); }
.hero__image { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.hero__index { margin: .8rem .15rem 0 auto; color: #f2b01e; font-size: .68rem; font-weight: 800; letter-spacing: .12em; text-align: right; }
.band { padding: clamp(3.5rem, 7vw, 7rem) max(1.25rem, calc((100vw - 1200px) / 2)); }
.band--paper { background: #fff; }
.band--green { background: #0a4a28; color: #fff; }
.content-grid { display: grid; grid-template-columns: minmax(9rem, .35fr) minmax(0, 1fr); gap: clamp(2rem, 6vw, 6rem); max-width: 1200px; margin: 0 auto; }
.section-heading { max-width: 1200px; margin: 0 auto 2.5rem; }
.section-number { color: #b04f08; }
.section-number span { color: rgb(18 38 26 / 72%); }
h2,h3,h4 { font-family: 'Lora', Georgia, 'Times New Roman', serif; font-weight: 700; }
.band h2 { max-width: 18ch; margin-top: .8rem; font-size: clamp(2.1rem, 4.3vw, 4rem); line-height: 1.08; }
.lead-copy { max-width: 58rem; margin-top: 1.3rem; color: #12261a; font-size: 1.08rem; line-height: 1.85; }
.event-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.4rem 2rem; margin-top: 2rem; border-top: 1px solid #d6ebd0; padding-top: 1.4rem; }
.event-facts div { display: grid; gap: .3rem; }
.event-facts span,.package-heading p,.small-note { color: rgb(18 38 26 / 72%); font-size: .82rem; line-height: 1.65; }
.event-facts strong { font-size: .9rem; line-height: 1.5; }
.section-heading h2 { max-width: 22ch; margin-top: .8rem; font-size: clamp(2.1rem, 4.3vw, 3.5rem); line-height: 1.08; }
.activity-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 1200px; margin: 0 auto; border-top: 1px solid #d6ebd0; }
.activity { display: flex; min-height: 18rem; flex-direction: column; align-items: flex-start; padding: 1.8rem; }
.activity + .activity { border-left: 1px solid #d6ebd0; }
.activity__label { color: #b04f08; }
.activity h3 { margin-top: 1.1rem; font-size: 2rem; }
.activity p:not(.activity__label) { max-width: 34rem; margin: .8rem 0 1.5rem; color: #12261a; line-height: 1.7; }
.activity .text-link { margin-top: auto; }
.package-heading { display: flex; max-width: 1200px; align-items: end; justify-content: space-between; gap: 2rem; margin: 3rem auto 1rem; }
.package-heading h3 { margin-top: .6rem; font-size: 1.8rem; }
.package-heading p { max-width: 26rem; }
.package-list { max-width: 1200px; margin: 0 auto; border-top: 1px solid #d6ebd0; }
.package-row { display: grid; grid-template-columns: 8rem minmax(0, 1fr) auto auto; align-items: center; gap: 1.5rem; border-bottom: 1px solid #d6ebd0; padding: 1.25rem 0; }
.package-row__image { display: block; width: 8rem; aspect-ratio: 4 / 3; object-fit: cover; border: 1px solid #d6ebd0; background: #f1f7ee; }
.package-row h4 { font-size: 1.35rem; }
.package-row p { margin-top: .4rem; color: rgb(18 38 26 / 72%); font-size: .84rem; }
.package-row__price { font-weight: 800; white-space: nowrap; }
.package-state { max-width: 1200px; margin: 0 auto; border-block: 1px solid #d6ebd0; padding: 1.4rem 0; color: #12261a; }
.package-state .text-link { margin-top: .8rem; }
.small-note { max-width: 1200px; margin: 1rem auto 0; }
.history p { margin-top: .8rem; color: #12261a; line-height: 1.75; }
.terms__intro,.terms__closing { margin-top: 1rem; color: #12261a; line-height: 1.75; }
.terms__group { margin-top: 2rem; }
.terms__group h3 { font-size: 1.5rem; }
.terms__list { margin-top: .8rem; border-top: 1px solid #d6ebd0; list-style: none; }
.terms__list li { display: grid; grid-template-columns: 2rem minmax(0, 1fr); gap: 1rem; border-bottom: 1px solid #d6ebd0; padding: 1rem 0; }
.terms__list li > span { color: #b04f08; font-size: .72rem; font-weight: 800; }
.terms__list h4 { font-size: 1rem; }
.terms__list p { margin-top: .35rem; color: #12261a; font-size: .9rem; line-height: 1.7; }
.agenda-list { margin-top: 1.5rem; border-top: 1px solid #d6ebd0; list-style: none; }
.agenda-list li { display: grid; grid-template-columns: 2rem minmax(10rem, .7fr) minmax(0, 1.2fr) auto; align-items: baseline; gap: 1rem; border-bottom: 1px solid #d6ebd0; padding: 1rem 0; }
.agenda-list li > span { color: #b04f08; font-size: .72rem; font-weight: 800; }
.agenda-list strong { font-size: .95rem; }
.agenda-list p { color: #12261a; font-size: .86rem; line-height: 1.55; }
.agenda-list em { color: #b04f08; font-size: .72rem; font-style: normal; }
.performer-empty,.prize-empty { margin-top: 2rem; border-block: 1px solid #d6ebd0; padding: 1.2rem 0; color: rgb(18 38 26 / 72%); font-weight: 700; }
.performer-showcase { margin-top: 2rem; overflow: hidden; border: 1px solid #d6ebd0; border-radius: 1.25rem; background: #f1f7ee; box-shadow: 0 18px 40px rgb(10 74 40 / 12%); }
.performer-showcase img { display: block; width: 100%; aspect-ratio: 16 / 8; object-fit: cover; }
.performer-showcase figcaption { padding: .8rem 1rem 1rem; color: #12261a; font-size: .85rem; line-height: 1.5; }
.prizes .section-number,.prizes .section-number span { color: #d6ebd0; }
.prizes .lead-copy { color: #d6ebd0; }
.prizes .prize-empty { border-color: #d6ebd0; color: #d6ebd0; }
.prize-showcase { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(15rem, .8fr); gap: 1.25rem; margin-top: 2rem; overflow: hidden; border: 1px solid rgb(255 255 255 / 18%); border-radius: 1.25rem; background: rgb(0 34 19 / 28%); }
.prize-showcase > img { display: block; width: 100%; height: 100%; min-height: 16rem; object-fit: cover; }
.prize-showcase__copy { padding: 1.25rem 1.25rem 1.4rem; }
.prize-showcase__label { color: #f2b01e; font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.prize-list { display: grid; gap: .65rem; margin-top: 1rem; padding: 0; list-style: none; }
.prize-list li { position: relative; padding-left: 1.1rem; color: #d6ebd0; font-size: .95rem; font-weight: 700; line-height: 1.4; }
.prize-list li::before { position: absolute; top: .55em; left: 0; width: .42rem; height: .42rem; border-radius: 50%; background: #7dbf45; content: ''; }
.history__intro { margin-top: 1rem; color: #12261a; line-height: 1.75; }
.history__stories { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1.8rem; }
.history-anniversary {
  margin-top: 1.8rem;
  overflow: hidden;
  border: 1px solid rgb(10 74 40 / 12%);
  border-radius: 1.25rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  background:
    radial-gradient(ellipse at 100% 0%, rgb(125 191 69 / 20%), transparent 42%),
    linear-gradient(135deg, #0a4a28, #07391f);
  box-shadow: 0 18px 40px rgb(10 74 40 / 14%);
  color: #fff;
}
.history-anniversary__heading { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .5rem 1rem; }
.history-anniversary__heading > p:last-child { color: rgb(255 255 255 / 76%); font-size: .88rem; }
.history-anniversary__eyebrow { color: #f2b01e; font-size: .72rem; font-weight: 900; letter-spacing: .12em; }
.history-anniversary__dates { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; margin-top: 1.2rem; }
.history-anniversary__date { border: 1px solid rgb(255 255 255 / 18%); border-radius: .9rem; padding: 1rem 1.1rem; background: rgb(255 255 255 / 7%); }
.history-anniversary__calendar { color: #d6ebd0; font-size: .78rem; font-weight: 800; }
.history-anniversary__number { margin-top: .35rem; color: #f2b01e; font-size: clamp(3rem, 7vw, 4.5rem); font-weight: 900; letter-spacing: -.07em; line-height: 1; }
.history-anniversary__number sup { margin-left: .2rem; font-size: .27em; letter-spacing: 0; vertical-align: super; }
.history-anniversary__title { margin-top: .25rem; color: #fff; font-size: .9rem; font-weight: 800; }
.history-anniversary__day { margin-top: .85rem; color: #fff; font-size: 1rem; font-weight: 800; }
.history-anniversary__equivalent { margin-top: .15rem; color: rgb(255 255 255 / 72%); font-size: .82rem; }
.history-anniversary + .button { margin-top: 1.2rem; }
.history-story { overflow: hidden; border: 1px solid #d6ebd0; background: #f1f7ee; }
.history-story__figure { margin: 0; }
.history-story__figure img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.history-story__figure figcaption { padding: .55rem 1rem 0; color: rgb(18 38 26 / 72%); font-size: .7rem; line-height: 1.4; }
.history-story__body { padding: 1rem; }
.history-story__date { color: #b04f08 !important; font-size: .7rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
.history-story__body h3 { margin-top: .4rem; font-size: 1.25rem; line-height: 1.25; }
.history-story__copy { margin-top: .6rem; color: #12261a; font-size: .86rem; line-height: 1.7; }
.history-story__link { display: inline-flex; margin-top: .9rem; color: #0a4a28; font-size: .82rem; font-weight: 900; text-decoration: underline; text-underline-offset: .2em; }
.faq-item { border-bottom: 1px solid #d6ebd0; padding: 1rem 0; }
.faq-item:first-of-type { margin-top: 1.2rem; border-top: 1px solid #d6ebd0; }
.faq-item summary { cursor: pointer; font-size: .98rem; font-weight: 800; }
.faq-item p { margin-top: .75rem; color: #12261a; line-height: 1.7; }
.faq .button { margin-top: 1.8rem; }
@media (max-width: 760px) {
  .hero { grid-template-columns: 1fr; gap: 2.5rem; min-height: auto; padding: 3.5rem 1.25rem 2.5rem; }
  .hero__content { max-width: 32rem; }
  .hero h1 { max-width: 12ch; font-size: clamp(3rem, 14vw, 4.8rem); }
  .hero__visual { width: 100%; }
  .hero__visual-frame { border-radius: 1.1rem; }
  .prize-showcase { grid-template-columns: 1fr; }
  .prize-showcase > img { min-height: 0; aspect-ratio: 16 / 10; }
  .content-grid { grid-template-columns: 1fr; gap: 1.4rem; }
  .activity-grid { grid-template-columns: 1fr; }
  .activity + .activity { border-left: 0; border-top: 1px solid #d6ebd0; }
  .package-heading { display: block; }
  .package-heading p { margin-top: .6rem; }
  .package-row { grid-template-columns: 5rem minmax(0, 1fr) auto; gap: .8rem; }
  .package-row__image { width: 5rem; }
  .package-row .button { grid-column: 1 / -1; }
  .agenda-list li { grid-template-columns: 2rem minmax(0, 1fr); gap: .4rem .8rem; }
  .agenda-list p,.agenda-list em { grid-column: 2; }
  .history__stories { grid-template-columns: 1fr; }
  .history-anniversary__dates { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { scroll-behavior: auto !important; transition-duration: .01ms !important; } }

.portal-home {
  --nu-green: #0a4a28;
  --nu-green-dark: #0a4a28;
  --nu-gold: #f2b01e;
  --nu-paper: #f1f7ee;
  --nu-line: #d6ebd0;
  color: #12261a;
  background: var(--nu-paper);
}

.hero {
  grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
  gap: clamp(2.5rem, 5vw, 5rem);
  min-height: min(700px, calc(100svh - 5rem));
  padding-inline: max(1.5rem, calc((100vw - 1280px) / 2));
  background:
    radial-gradient(ellipse at 82% 18%, rgb(125 191 69 / 20%), transparent 34%),
    radial-gradient(ellipse at 14% 100%, rgb(242 176 30 / 12%), transparent 35%),
    linear-gradient(118deg, #0a4a28 0%, #0a4a28 58%, #13803e 100%);
}

.hero::before {
  background:
    radial-gradient(circle at 85% 15%, rgb(125 191 69 / 18%), transparent 32%),
    radial-gradient(circle at 20% 100%, rgb(242 176 30 / 10%), transparent 30%);
}

.hero::after {
  position: absolute;
  z-index: -1;
  top: -7rem;
  right: 34%;
  color: rgb(242 123 33 / 8%);
  content: '101';
  font-family: 'Lora', Georgia, serif;
  font-size: clamp(18rem, 34vw, 34rem);
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
}

.hero__content {
  max-width: 39rem;
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: .65rem;
  color: #f2b01e;
  letter-spacing: .14em;
}

.hero__eyebrow::before {
  width: 1.8rem;
  height: 1px;
  background: currentColor;
  content: '';
}

.hero h1 {
  max-width: 12ch;
  margin-block: 1.35rem 1.15rem;
  font-family: 'Lora', Georgia, 'Times New Roman', serif;
  font-size: clamp(3.2rem, 6vw, 6rem);
  line-height: .98;
  letter-spacing: -.045em;
}

.hero__lead {
  max-width: 35rem;
  color: #d6ebd0;
  line-height: 1.8;
}

.hero__actions {
  margin-top: 2rem;
}

.button {
  min-height: 3.15rem;
  border-radius: 999px;
  padding-inline: 1.35rem;
  box-shadow: 0 8px 20px rgb(3 32 19 / 12%);
  transition: background .18s ease, color .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgb(3 32 19 / 20%);
}

.button--gold {
  border-color: #f2b01e;
  background: #f2b01e;
  color: #12261a;
}

.button--gold:hover,
.button--light:hover {
  border-color: #7dbf45;
  background: #7dbf45;
}

.button--outline {
  border-color: rgb(255 255 255 / 42%);
  background: rgb(255 255 255 / 5%);
  backdrop-filter: blur(8px);
}

.button--outline:hover {
  border-color: #7dbf45;
  background: rgb(255 255 255 / 12%);
}

.button--dark {
  border-radius: 999px;
  box-shadow: none;
}

.hero__visual-frame {
  aspect-ratio: 1.62 / 1;
  border: 1px solid rgb(255 255 255 / 25%);
  border-radius: 1.75rem;
  box-shadow: 0 32px 80px rgb(0 25 14 / 34%), 0 0 0 8px rgb(255 255 255 / 4%);
}

.hero__image {
  transition: transform .7s cubic-bezier(.2, .7, .2, 1);
}

.hero__visual-frame:hover .hero__image {
  transform: scale(1.035);
}

.hero__anniversary {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  display: flex;
  align-items: center;
  gap: .7rem;
  border: 1px solid rgb(255 255 255 / 32%);
  border-radius: 1rem;
  padding: .55rem .85rem .55rem .65rem;
  background: rgb(10 74 40 / 88%);
  box-shadow: 0 12px 30px rgb(0 25 14 / 20%);
  color: #fff;
  backdrop-filter: blur(12px);
}

.hero__anniversary-number {
  color: #f2b01e;
  font-family: 'Lora', Georgia, serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.hero__anniversary-copy {
  display: grid;
  gap: .2rem;
  font-size: .58rem;
  font-weight: 800;
  letter-spacing: .1em;
  line-height: 1.3;
}

.hero__anniversary-copy small {
  color: #d6ebd0;
  font-size: .62rem;
  font-weight: 600;
  letter-spacing: .05em;
}

.hero__index {
  color: #f2b01e;
}

.band {
  padding-block: clamp(4rem, 8vw, 7.5rem);
}

.band--paper {
  background: #f1f7ee;
}

.band--green {
  background:
    radial-gradient(ellipse at 100% 0%, rgb(125 191 69 / 14%), transparent 38%),
    linear-gradient(135deg, #0a4a28, #0a4a28 68%, #13803e);
}

.section-number {
  color: #b04f08;
}

.section-number span {
  color: #12261a;
}

.band h2,
.section-heading h2 {
  letter-spacing: -.04em;
}

.intro .content-grid > div,
.terms .content-grid > div,
.agenda .content-grid > div,
.history .content-grid > div,
.bazaar .content-grid > div {
  min-width: 0;
}

.event-facts {
  gap: .75rem;
  border: 0;
  padding-top: 0;
}

.event-facts div {
  min-height: 5.2rem;
  border: 1px solid var(--nu-line);
  border-radius: 1rem;
  padding: .9rem 1rem;
  background: rgb(255 255 255 / 76%);
}

.event-facts span,
.package-heading p,
.small-note {
  color: rgb(18 38 26 / 72%);
}

.event-facts strong {
  color: #0a4a28;
}

.activity-grid {
  gap: 1rem;
  border: 0;
}

.activity {
  min-height: 19rem;
  border: 1px solid var(--nu-line);
  border-radius: 1.5rem;
  padding: clamp(1.4rem, 3vw, 2rem);
  background:
    radial-gradient(circle at 100% 0%, rgb(242 176 30 / 12%), transparent 42%),
    linear-gradient(145deg, #fff, #f1f7ee);
  box-shadow: 0 12px 35px rgb(28 60 39 / 6%);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

.activity:hover {
  transform: translateY(-4px);
  border-color: rgb(7 91 54 / 24%);
  box-shadow: 0 20px 45px rgb(28 60 39 / 11%);
}

.activity + .activity {
  border-left: 1px solid var(--nu-line);
}

.activity__label {
  color: #b04f08;
}

.activity h3 {
  color: #0a4a28;
}

.activity p:not(.activity__label) {
  color: rgb(18 38 26 / 72%);
}

.text-link {
  text-decoration-color: rgb(7 91 54 / 32%);
  transition: color .18s ease, gap .18s ease;
}

.text-link:hover {
  gap: .75rem;
  color: #13803e;
}

.package-heading {
  margin-top: 3.5rem;
}

.package-list {
  overflow: hidden;
  border: 1px solid var(--nu-line);
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 12px 35px rgb(28 60 39 / 5%);
}

.package-row {
  padding: 1.15rem;
}

.package-row:last-child {
  border-bottom: 0;
}

.package-row__image {
  overflow: hidden;
  border-radius: .8rem;
}

.package-row__price {
  color: #b04f08;
}

.package-state {
  border: 1px solid var(--nu-line);
  border-radius: 1rem;
  padding: 1.25rem;
  background: #fff;
}

.terms__list,
.agenda-list {
  border-color: var(--nu-line);
}

.terms__list li,
.agenda-list li,
.faq-item {
  border-color: var(--nu-line);
}

.terms__list li > span,
.agenda-list li > span {
  color: #b04f08;
}

.agenda-list strong {
  color: #0a4a28;
}

.agenda-list em {
  border: 1px solid rgb(214 235 208 / 80%);
  border-radius: 999px;
  padding: .35rem .65rem;
  background: #f1f7ee;
  color: #12261a;
  white-space: nowrap;
}

.performer-showcase,
.history-story {
  border-color: var(--nu-line);
  border-radius: 1.25rem;
  box-shadow: 0 14px 36px rgb(28 60 39 / 8%);
}

.performer-showcase figcaption {
  background: #fff;
}

.history-story {
  transition: transform .2s ease, box-shadow .2s ease;
}

.history-story:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 42px rgb(28 60 39 / 13%);
}

.history-story__date {
  color: #b04f08 !important;
}

.history-story__link {
  color: #0a4a28;
  text-underline-offset: .25rem;
}

.faq-item summary {
  transition: color .18s ease;
}

.faq-item summary:hover {
  color: #13803e;
}

@media (max-width: 760px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3.75rem 1.25rem 2.75rem;
  }

  .hero::after {
    top: 1rem;
    right: -2rem;
    font-size: 16rem;
  }

  .hero h1 {
    max-width: 11ch;
    font-size: clamp(3rem, 13vw, 4.8rem);
  }

  .hero__visual-frame {
    aspect-ratio: 1.45 / 1;
    border-radius: 1.25rem;
  }

  .event-facts {
    grid-template-columns: 1fr;
  }

  .activity-grid {
    gap: .8rem;
  }

  .activity {
    min-height: 16rem;
  }

  .activity + .activity {
    border-top: 1px solid var(--nu-line);
    border-left: 1px solid var(--nu-line);
  }

  .package-list {
    border-radius: 1rem;
  }

  .package-row {
    padding: .9rem;
  }

  .agenda-list em {
    justify-self: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__image,
  .activity,
  .history-story,
  .button {
    transition: none;
  }
}
</style>
