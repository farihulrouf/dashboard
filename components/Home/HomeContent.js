import {
  Assignment,
  SupervisorAccount,
  PeopleAlt,
  Business,
} from "@material-ui/icons";

const features = [
  {
    icon: (styles) => <Assignment style={styles} />,
    iconColor: "rgb(33, 150, 243)",
    iconBackgroundColor: "#e3f2fd",
    number: "1000+",
    title: "Online Courses",
    body: "Choose from over 1000+ online courses and join the community",
  },
  {
    icon: (styles) => <SupervisorAccount style={styles} />,
    iconColor: "rgb(156, 39, 176)",
    iconBackgroundColor: "#f3e5f5",
    number: "200+",
    title: "Expert Tutors",
    body:
      "More than two hundred expert tutors are ready to take you into the next level",
  },
  {
    icon: (styles) => <PeopleAlt style={styles} />,
    iconColor: "rgb(233, 30, 99)",
    iconBackgroundColor: "#fce4ec",
    number: "1M+",
    title: "Active Students",
    body:
      "We have more than 1 Million students actively learning in our platform",
  },
  {
    icon: (styles) => <Business style={styles} />,
    iconColor: "rgb(63, 81, 181)",
    iconBackgroundColor: "#e8eaf6",
    number: "10+",
    title: "Company Partners",
    body: "Get hired by our company partners",
  },
];
const testimonies = [
  {
    comment:
      "Berbagi ilmu di platform ini menjadi lebih mudah karena bisa interaksi dua arah",
    name: "Ramandika",
    title: "Senior Software Engineer @Qontak.com",
    image: "images/dummy.png",
  },
  {
    comment: "Belajar materi IF di sini banyak yang share dan bisa tanya2",
    name: "Ramandika",
    title: "Mahasiswa IF ITB",
    image: "images/dummy.png",
  },
  {
    comment: "Cari engineer di sini sangat mudah dan berkualiatas",
    name: "Ramandika",
    title: "Lead Software Engineer @Pinhome",
    image: "images/dummy.png",
  },
];

const course = [
  {
    courseImage: "images/dummy.png",
    name: "Data Science",
    desc:
      "ITB Kalkulus Series lorem ipsum dolor sit amet lorem ipsum lorem ipsum dd",
    instructors: [
      {
        name: "Habib Rizieq",
        photo: "images/dummy.png",
      },
      {
        name: "Soleh Pati",
        photo: "images/dummy.png",
      },
      {
        name: "Entis Sutisna",
        photo: "images/dummy.png",
      },
      {
        name: "Rudi Khoyrudi",
        photo: "images/dummy.png",
      },
    ],
    price: "Rp 25.000",
    review: "5.0",
    reviewNum: "28",
  },
  {
    courseImage: "images/dummy.png",
    name: "Data Science",
    desc:
      "ITB Kalkulus Series lorem ipsum dolor sit amet lorem ipsum lorem ipsum dd",
    instructors: [
      {
        name: "Habib Rizieq",
        photo: "images/dummy.png",
      },
      {
        name: "Soleh Pati",
        photo: "images/dummy.png",
      },
      {
        name: "Entis Sutisna",
        photo: "images/dummy.png",
      },
      {
        name: "Rudi Khoyrudi",
        photo: "images/dummy.png",
      },
    ],
    price: "Rp 25.000",
    review: "5.0",
    reviewNum: "28",
  },
  {
    courseImage: "images/dummy.png",
    name: "Data Science",
    desc:
      "ITB Kalkulus Series lorem ipsum dolor sit amet lorem ipsum lorem ipsum dd",
    instructors: [
      {
        name: "Habib Rizieq",
        photo: "images/dummy.png",
      },
      {
        name: "Soleh Pati",
        photo: "images/dummy.png",
      },
      {
        name: "Entis Sutisna",
        photo: "images/dummy.png",
      },
      {
        name: "Rudi Khoyrudi",
        photo: "images/dummy.png",
      },
    ],
    price: "Rp 25.000",
    review: "5.0",
    reviewNum: "28",
  },
  {
    courseImage: "images/dummy.png",
    name: "Data Science",
    desc:
      "ITB Kalkulus Series lorem ipsum dolor sit amet lorem ipsum lorem ipsum dd",
    instructors: [
      {
        name: "Habib Rizieq",
        photo: "images/dummy.png",
      },
      {
        name: "Soleh Pati",
        photo: "images/dummy.png",
      },
      {
        name: "Entis Sutisna",
        photo: "images/dummy.png",
      },
      {
        name: "Rudi Khoyrudi",
        photo: "images/dummy.png",
      },
    ],
    price: "Rp 25.000",
    review: "5.0",
    reviewNum: "28",
  },
  {
    courseImage: "images/dummy.png",
    name: "Data Science",
    desc:
      "ITB Kalkulus Series lorem ipsum dolor sit amet lorem ipsum lorem ipsum dd",
    instructors: [
      {
        name: "Habib Rizieq",
        photo: "images/dummy.png",
      },
      {
        name: "Soleh Pati",
        photo: "images/dummy.png",
      },
      {
        name: "Entis Sutisna",
        photo: "images/dummy.png",
      },
      {
        name: "Rudi Khoyrudi",
        photo: "images/dummy.png",
      },
    ],
    price: "Rp 25.000",
    review: "5.0",
    reviewNum: "28",
  },
];

export { testimonies, features, course };
