# Tutorial Next JS Pemula: Belajar Menerapkan Types TypeScript

![global](https://buildwithangga.com/themes/front/images/global.svg)

October 13, 2024


•
[Frontend Development](https://buildwithangga.com/tips/category/frontend-development)

![Tutorial Next JS Pemula: Belajar Menerapkan Types TypeScript](https://bwaplatformbucket.sgp1.cdn.digitaloceanspaces.com/assets/thumbnail_tips/BuildWithAngga-thumbnail-tips-ZXsoP-tutorial-next-js-pemula-belajar-menerapkan-types-typescript-Tutorial%20Next%20JS%20Pemula%20Belajar%20Menerapkan%20Types%20TypeScript%20buildwithangga.png)

[Next.js](https://nextjs.org/) adalah salah satu framework populer yang banyak digunakan oleh developer untuk [membangun website modern](https://buildwithangga.com/belajar/web-development), baik frontend maupun backend. Dengan Next.js, developer dapat mengelola berbagai fitur yang mendukung pembuatan website dengan performa tinggi dan pengalaman pengguna yang baik. Framework ini memudahkan developer dalam mengelola routing, server-side rendering, dan API, membuatnya menjadi pilihan utama dalam dunia web development.

Menggunakan [Next.js](https://buildwithangga.com/belajar/next-js) tidak hanya memberikan kelebihan pada sisi kecepatan dan kemudahan integrasi dengan tools lainnya, tapi juga menawarkan fleksibilitas bagi developer untuk menyesuaikan projek sesuai kebutuhan bisnis dan teknologi yang diinginkan.

### Mengapa TypeScript Cocok untuk Projek Next.js?

Memilih TypeScript sebagai bahasa yang digunakan di dalam projek Next.js adalah langkah yang sangat tepat, terutama jika tujuan jangka panjang adalah menciptakan kode yang lebih aman dan mudah dikelola. TypeScript menawarkan sistem pengetikan yang lebih ketat dibandingkan JavaScript murni, sehingga meminimalkan kemungkinan terjadinya error pada saat runtime. Hal ini penting, terutama ketika bekerja dalam tim besar atau pada projek yang kompleks.

Selain itu, TypeScript memudahkan developer untuk menulis kode yang lebih terstruktur dan konsisten. Dengan adanya type checking, kesalahan dalam passing data atau penggunaan fungsi dapat terdeteksi lebih awal saat proses development. Ini dapat meningkatkan produktivitas serta mengurangi waktu debugging yang diperlukan.

### Tata Cara Membuat Projek Next.js Terbaru

Untuk memulai projek Next.js terbaru, kamu bisa menggunakan perintah sederhana dengan menggunakan terminal. Pastikan kamu sudah menginstal Node.js terlebih dahulu agar bisa menggunakan Next.js. Berikut adalah langkah-langkah untuk membuat projek Next.js menggunakan perintah di terminal:

Buka terminal dan jalankan perintah berikut untuk menginstal Next.js secara global:

```perl
npx create-next-app@latest my-nextjs-project
```

Setelah proses instalasi selesai, masuk ke direktori projek yang telah dibuat:

```bash
cd my-nextjs-project
```

Kemudian, jalankan server development untuk melihat hasil dari projek Next.js:

```undefined
npm run dev
```

Kamu bisa membuka browser dan mengunjungi `http://localhost:3000` untuk melihat tampilan awal dari projek Next.js yang baru saja dibuat. Dengan ini, projek Next.js sudah siap untuk dikembangkan lebih lanjut.

### Mengenal Beberapa Tipe TypeScript: Primitive, Array, Object, Union, dan Lainnya

TypeScript menyediakan berbagai jenis tipe data (types) yang membantu developer menulis kode yang lebih aman dan jelas. Beberapa tipe TypeScript yang sering digunakan adalah primitive types, array, object, dan union. Berikut penjelasannya beserta contoh kode.

**Primitive Types**

Primitive types mencakup tipe data dasar seperti `string`, `number`, `boolean`, dan lainnya. Ini adalah tipe data yang paling sederhana dan sering digunakan dalam pemrograman.

Contoh kode:

```typescript
let name: string = "John Doe";
let age: number = 30;
let isDeveloper: boolean = true;
```

**Array**

Array adalah tipe data yang dapat menyimpan banyak nilai dalam satu variabel. TypeScript memungkinkan kita untuk menentukan tipe data dari elemen-elemen di dalam array.

Contoh kode:

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
```

**Object**

Object digunakan untuk menyimpan data dalam bentuk pasangan key-value. Dengan TypeScript, kita bisa mendefinisikan struktur objek agar lebih jelas.

Contoh kode:

```yaml
let person: { name: string; age: number; isDeveloper: boolean } = {
  name: "Jane Doe",
  age: 28,
  isDeveloper: true
};
```

**Union**

Union type memungkinkan sebuah variabel memiliki lebih dari satu tipe data. Ini sangat berguna ketika variabel bisa berisi beberapa jenis nilai yang berbeda.

Contoh kode:

```typescript
let id: number | string;
id = 101;  // valid
id = "A101";  // valid
```

**Optional Types**

Optional types digunakan ketika sebuah properti atau parameter bersifat opsional, artinya tidak selalu ada.

Contoh kode:

```typescript
let user: { name: string; age?: number } = { name: "Tom" };  // age bersifat opsional
```

Dengan berbagai tipe TypeScript ini, developer dapat membuat kode yang lebih aman, mudah dipahami, dan mudah di-maintain, terutama dalam projek Next.js yang cenderung memiliki banyak tipe data kompleks.

### Tata Cara Membuat Types untuk Data Products, Testimonials, Transactions, Categories

Dalam Next.js yang menggunakan TypeScript, mendefinisikan types untuk berbagai data seperti produk, testimoni, transaksi, dan kategori membantu dalam menjaga struktur data yang konsisten. TypeScript memberikan kejelasan tentang bentuk data, sehingga dapat mengurangi potensi error dan meningkatkan keterbacaan kode. Berikut adalah cara membuat types untuk data tersebut.

**Contoh kode untuk type Products:**

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  categoryId: number;
  isFeatured: boolean;
};
```

Type `Product` mencakup properti seperti `id`, `name`, `price`, `stock`, `description`, `categoryId`, dan `isFeatured`. Type ini mendefinisikan produk dengan lengkap, termasuk harganya (`price`), stok yang tersedia (`stock`), deskripsi produk (`description`), dan apakah produk ini ditampilkan sebagai produk unggulan (`isFeatured`).

**Contoh kode untuk type Testimonials:**

```typescript
type Testimonial = {
  id: number;
  name: string;
  feedback: string;
  productId: number;
  rating: number;
};
```

Type `Testimonial` mengelola data ulasan dari pengguna, termasuk nama pengguna (`name`), ulasan (`feedback`), serta ID produk (`productId`) dan rating (`rating`).

**Contoh kode untuk type Transactions:**

```typescript
type Transaction = {
  id: number;
  productId: number;
  userId: number;
  quantity: number;
  totalAmount: number;
  transactionDate: string;
};
```

Type `Transaction` menggambarkan transaksi yang terjadi di aplikasi, termasuk ID produk (`productId`), ID pengguna (`userId`), jumlah produk yang dibeli (`quantity`), total harga (`totalAmount`), dan tanggal transaksi (`transactionDate`).

**Contoh kode untuk type Categories:**

```typescript
type Category = {
  id: number;
  name: string;
  totalProducts: number;
  isPopular: boolean;
};
```

Type `Category` mendefinisikan kategori produk dengan atribut seperti `id`, `name`, jumlah produk dalam kategori (`totalProducts`), dan apakah kategori ini populer (`isPopular`).

Dengan type di atas, kamu bisa memastikan bahwa data yang digunakan dalam aplikasi memiliki struktur yang jelas dan seragam, sehingga memudahkan pengelolaan dan debugging.

### Tata Cara Mengimplementasikan Types pada Dummy Data

Setelah membuat type untuk data `products`, `testimonials`, `transactions`, dan `categories`, langkah selanjutnya adalah mengimplementasikan types ini pada dummy data. Dengan menggunakan TypeScript, kamu bisa membuat dummy data yang sudah sesuai dengan types yang telah didefinisikan, sehingga validasi data lebih ketat dan kode lebih aman.

**Contoh Dummy Data untuk Products:**

```yaml
const products: Product[] = [\
  {\
    id: 1,\
    name: "Ebook A",\
    price: 100000,\
    stock: 20,\
    description: "Ebook A tentang pengembangan web modern",\
    categoryId: 1,\
    isFeatured: true\
  },\
  {\
    id: 2,\
    name: "Ebook B",\
    price: 150000,\
    stock: 10,\
    description: "Ebook B membahas teknik advanced web development",\
    categoryId: 2,\
    isFeatured: false\
  }\
];
```

Pada contoh di atas, kita membuat dummy data produk dengan type `Product` yang sudah dibuat sebelumnya. Setiap produk memiliki ID, nama, harga, stok, deskripsi, ID kategori, dan status apakah produk tersebut unggulan atau tidak (`isFeatured`).

**Contoh Dummy Data untuk Categories:**

```yaml
const categories: Category[] = [\
  {\
    id: 1,\
    name: "Web Development",\
    totalProducts: 5,\
    isPopular: true\
  },\
  {\
    id: 2,\
    name: "Design",\
    totalProducts: 8,\
    isPopular: false\
  }\
];
```

Dummy data kategori juga didefinisikan menggunakan type `Category`, sehingga data kategori memiliki informasi seperti ID, nama kategori, jumlah produk dalam kategori tersebut (`totalProducts`), dan apakah kategori tersebut populer atau tidak.

### Mapping Dummy Data di Halaman Home Next.js

Setelah dummy data dibuat, langkah selanjutnya adalah memetakan data tersebut pada halaman Home di Next.js. Tujuan dari mapping ini adalah untuk menampilkan produk berdasarkan kategori yang dipilih. Berikut adalah langkah-langkah dan contoh implementasinya.

1. **Menampilkan Kategori dengan Filter Produk** Kita akan menggunakan state untuk menyimpan kategori yang sedang dipilih dan menggunakan filter untuk menampilkan produk yang sesuai dengan kategori yang dipilih.
2. **Menggunakan `useState` untuk Menyimpan Kategori yang Aktif** Untuk mengatur kategori yang aktif, kita akan menggunakan hook `useState`. State ini akan digunakan untuk menyimpan ID kategori yang sedang dipilih oleh pengguna.
3. **Melakukan Mapping dan Filtering Produk** Pada tahap ini, kita akan memetakan kategori dalam bentuk tombol dan melakukan filtering produk berdasarkan kategori yang dipilih. Jika tidak ada kategori yang dipilih, semua produk akan ditampilkan.

**Contoh Implementasi di Halaman Home:**

```typescript
import { useState } from 'react';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <div>
      <h1>Daftar Produk</h1>

      {/* Mapping Kategori */}
      <div>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            style={{ margin: '10px', padding: '5px 15px', background: category.isPopular ? 'green' : 'blue', color: 'white' }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Filtering dan Mapping Produk */}
      <div>
        {products
          .filter(product => !activeCategory || product.categoryId === activeCategory)
          .map(product => (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Harga: {product.price}</p>
              <p>Stok: {product.stock}</p>
              {product.isFeatured && <span>Produk Unggulan</span>}
            </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
```

### Penjelasan Implementasi

Pada contoh di atas, terdapat beberapa poin penting terkait implementasi:

- **State Active Category**: Menggunakan `useState` untuk menyimpan kategori yang sedang aktif. Saat pengguna mengklik tombol kategori, state akan di-update dengan ID kategori tersebut.
- **Mapping Kategori**: Menggunakan `map` untuk menampilkan semua kategori sebagai tombol. Masing-masing tombol kategori memiliki fungsi `onClick` untuk mengubah kategori yang aktif.
- **Filtering Produk**: Produk yang ditampilkan di halaman difilter berdasarkan kategori yang aktif. Jika tidak ada kategori yang dipilih (`activeCategory === null`), maka semua produk akan ditampilkan. Jika ada kategori yang dipilih, produk yang ditampilkan hanya yang memiliki `categoryId` sesuai dengan ID kategori yang aktif.
- **Mapping Produk**: Setelah difilter, produk yang sesuai dengan kategori akan dimapping dan ditampilkan dengan informasi seperti nama produk, deskripsi, harga, stok, dan tanda jika produk tersebut adalah produk unggulan.

Dengan implementasi ini, pengguna dapat memilih kategori untuk melihat produk-produk yang relevan dengan kategori tersebut. Selain itu, tipe data yang digunakan (TypeScript types) memberikan struktur yang jelas, sehingga proses development lebih terorganisir dan minim error.

Menggunakan TypeScript di dalam Next.js juga meningkatkan keterbacaan dan pengelolaan kode, terutama untuk projek yang besar atau memiliki banyak data yang perlu ditangani. Dengan dummy data dan proses mapping ini, kamu sudah berhasil menerapkan TypeScript dalam pengelolaan produk dan kategori di aplikasi Next.js.

### 5 Kesalahan Menggunakan TypeScript pada Projek Next.js

Walaupun TypeScript sangat membantu dalam memastikan kode lebih aman dan terstruktur, seringkali developer membuat beberapa kesalahan saat menggunakannya di dalam projek Next.js. Berikut adalah beberapa kesalahan umum dan cara menghindarinya dengan contoh koding yang lengkap.

**1\. Mengabaikan Penulisan Type Secara Eksplisit**

Kesalahan pertama yang sering terjadi adalah developer tidak mendefinisikan type secara eksplisit, mengandalkan inferensi dari TypeScript. Walaupun TypeScript dapat menginfer type secara otomatis, namun menulis type secara eksplisit membantu dalam memahami kode dengan lebih jelas.

Contoh kesalahan:

```cpp
const product = {
  name: "Ebook A",
  price: 100000,
};
```

Solusi yang benar:

```typescript
type Product = {
  name: string;
  price: number;
};

const product: Product = {
  name: "Ebook A",
  price: 100000,
};
```

Menuliskan type secara eksplisit pada `product` memastikan struktur data yang lebih jelas dan mudah dipahami.

**2\. Tidak Menggunakan Union Types Secara Efisien**

Union types memungkinkan sebuah variabel untuk memiliki lebih dari satu type, namun seringkali developer tidak memanfaatkannya dengan baik, sehingga menyebabkan kode menjadi terlalu kaku.

Contoh kesalahan:

```bash
let id: number;
id = 123;  // valid
id = "ABC";  // error
```

Solusi yang benar:

```typescript
let id: number | string;
id = 123;  // valid
id = "ABC";  // valid
```

Dengan menggunakan union types, variabel `id` dapat menampung nilai baik berupa `number` maupun `string`.

**3\. Tidak Menggunakan Optional Properties**

Kesalahan umum lainnya adalah tidak memanfaatkan properti opsional pada object. Hal ini menyebabkan kode menjadi lebih rumit karena developer perlu selalu mengisi semua properti object, meskipun tidak semuanya wajib.

Contoh kesalahan:

```typescript
type User = {
  name: string;
  email: string;
  age: number;
};

const user: User = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
};
```

Solusi yang benar:

```typescript
type User = {
  name: string;
  email: string;
  age?: number;  // properti opsional
};

const user: User = {
  name: "John Doe",
  email: "john@example.com",
};
```

Dengan menambahkan tanda `?` pada properti `age`, properti tersebut menjadi opsional, sehingga tidak wajib diisi.

**4\. Tidak Menggunakan `any` secara Bijaksana**

Terkadang, developer menggunakan type `any` secara berlebihan untuk menangani berbagai jenis data tanpa melakukan validasi. Penggunaan `any` yang tidak bijaksana bisa menghilangkan manfaat utama TypeScript, yaitu keamanan type.

Contoh kesalahan:

```kotlin
let data: any;
data = "Hello";
data = 123;
data = { name: "Ebook A" };
```

Solusi yang benar:

```kotlin
let data: string | number | { name: string };
data = "Hello";  // valid
data = 123;  // valid
data = { name: "Ebook A" };  // valid
```

Dengan mendefinisikan union type, kamu bisa menangani berbagai jenis data tanpa menghilangkan validasi tipe.

**5\. Tidak Menggunakan Type Assertion dengan Tepat**

Type assertion digunakan ketika kita yakin bahwa suatu nilai memiliki type tertentu. Namun, kesalahan yang sering terjadi adalah menggunakan type assertion dengan tidak tepat, sehingga justru menyebabkan error di runtime.

Contoh kesalahan:

```javascript
const input = document.getElementById("user-input") as HTMLInputElement;
input.value = "Hello";  // asumsi bahwa elemen ini selalu ada
```

Solusi yang benar:

```javascript
const input = document.getElementById("user-input");

if (input instanceof HTMLInputElement) {
  input.value = "Hello";  // pastikan elemen ada dan tipe-nya benar
}
```

Dengan memeriksa terlebih dahulu apakah elemen yang dimaksud benar-benar `HTMLInputElement`, kamu dapat menghindari potensi error di runtime.

Menggunakan TypeScript dengan bijaksana akan sangat membantu dalam menjaga keamanan dan kejelasan kode, terutama dalam proyek Next.js yang kompleks. Menghindari kesalahan-kesalahan di atas dapat meningkatkan kualitas proyekmu secara signifikan.

### Penutup

Menggunakan TypeScript dalam proyek Next.js memang bisa memberikan banyak manfaat, terutama dalam menjaga kualitas dan keamanan kode. Dengan menghindari kesalahan umum yang sering dilakukan, kamu bisa mengembangkan aplikasi web yang lebih terstruktur dan minim error.

Jika kamu ingin memperdalam pemahamanmu mengenai TypeScript, Next.js, atau topik web development lainnya, kamu bisa belajar bersama mentor expert di [**BuildWithAngga**](https://buildwithangga.com/). Di sana, kamu akan mendapatkan berbagai benefit, seperti **akses selamanya** ke semua materi, bimbingan untuk membangun **portfolio berkualitas**, kesempatan untuk **konsultasi langsung dengan mentor**, serta banyak **benefit menarik lainnya** yang akan membantu kamu mempersiapkan diri untuk karir di industri teknologi.

Jadi, tunggu apalagi? Tingkatkan skill kamu dan wujudkan mimpi menjadi developer handal bersama BuildWithAngga!

#### Pelajari Selengkapnya

![Kelas Full-Stack Next JS Laravel 11: Web Langganan Catering di BuildWithAngga](https://buildwithangga.com/storage/assets/thumbnails/Buildwithangga-course-K91rN-full-stack-next-js-laravel-11-web-langganan-catering-Kelas%20FullStack%20Next%20JS%20Laravel%2011%20Web%20Langganan%20Catering.webp)

[Full-Stack Next JS Laravel 11: Web Langganan Catering](https://buildwithangga.com/kelas/full-stack-next-js-laravel-11-web-langganan-catering?main_leads=tips)

![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)
(211)


![Kelas Full-Stack Laravel 11 Next JS: Bikin Web Paket Pernikahan di BuildWithAngga](https://buildwithangga.com/storage/assets/thumbnails/Buildwithangga-course-5r3BP-full-stack-laravel-11-next-js-bikin-web-paket-pernikahan-Full-Stack%20Laravel%2011%20Next%20JS%20Bikin%20Web%20Paket%20Pernikahan%20buildwithangga.webp)

[Full-Stack Laravel 11 Next JS: Bikin Web Paket Pernikahan](https://buildwithangga.com/kelas/full-stack-laravel-11-next-js-bikin-web-paket-pernikahan?main_leads=tips)

![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)
(317)


![Kelas Full-Stack Laravel 11 Next JS 14: Web Rent House di BuildWithAngga](https://buildwithangga.com/storage/assets/thumbnails/Buildwithangga-course-bjmE2-full-stack-laravel-11-next-js-14-web-rent-house-kelas%20online%20Full-Stack%20Laravel%2011%20Next%20JS%2014_%20Web%20Rent%20House%20buildwithangga.webp)

[Full-Stack Laravel 11 Next JS 14: Web Rent House](https://buildwithangga.com/kelas/full-stack-laravel-11-next-js-14-web-rent-house?main_leads=tips)

![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)![ic_star](https://buildwithangga.com/themes/front/images/ic_star.svg)
(745)


[Chat ke CS](https://buildwithangga.com/contact-us) [Karir HandBook](https://buildwithangga.com/handbook)

### Content Editor

![Angga Risky S](https://buildwithangga.com/themes/front/images/default-avatar.svg)

Angga Risky S


Angga Risky S, an expert content writer at BuildWithAngga, continually acquires valuable knowledge in web technology, UI UX design, SEO, and business. This knowledge is shared freely with the extensive community in Indonesia.


* * *

[![logo BuildWithAngga](https://buildwithangga.com/themes/front/images/logo-text.svg)\\
\\
BuildWithAngga](https://buildwithangga.com/tips)

#### Explore More

- [Discover](https://buildwithangga.com/tips)
- [Automation](https://buildwithangga.com/tips/category/automation)
- [Backend Development](https://buildwithangga.com/tips/category/backend-development)
- [Business Intelligence](https://buildwithangga.com/tips/category/business-intelligence)
- [Cloud Devops Engineer](https://buildwithangga.com/tips/category/cloud-devops-engineer)
- [Code](https://buildwithangga.com/tips/category/code)
- [Cybersecurity](https://buildwithangga.com/tips/category/cybersecurity)
- [Design](https://buildwithangga.com/tips/category/design)
- [Finance dan Accounting](https://buildwithangga.com/tips/category/finance-dan-accounting)
- [Frontend Development](https://buildwithangga.com/tips/category/frontend-development)
- [Full Stack](https://buildwithangga.com/tips/category/full-stack)
- [Graphic Design](https://buildwithangga.com/tips/category/graphic-design)
- [Growth dan Digital Marketing](https://buildwithangga.com/tips/category/growth-dan-digital-marketing)
- [Product UI/UX Design](https://buildwithangga.com/tips/category/product-ui-ux-design)
- [Soft Skills](https://buildwithangga.com/tips/category/soft-skills)
- [User-Experience](https://buildwithangga.com/tips/category/user-experience-design)
- [User-Interface](https://buildwithangga.com/tips/category/user-interface-design)