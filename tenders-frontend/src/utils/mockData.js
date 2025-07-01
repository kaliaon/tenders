// Mock data for tenders system
export const mockTenders = [
  {
    id: 1,
    title: "Мемлекеттік ақпараттық жүйелерді әзірлеу",
    description:
      "Мемлекеттік қызметтерді көрсету үшін ақпараттық жүйелерді әзірлеу және енгізу",
    budget: 45000000,
    deadline: "2023-12-31",
    status: "open",
    category: "IT және цифрландыру",
    createdAt: "2023-05-15",
    company: "Цифрлық даму министрлігі",
    location: "Астана, Қазақстан",
    requirements: [
      "5+ жыл IT саласындағы тәжірибе",
      "Мемлекеттік жобаларда жұмыс тәжірибесі",
      "Ақпараттық қауіпсіздік стандарттарын білу",
    ],
    contact: "it-projects@gov.kz",
  },
  {
    id: 2,
    title: "Мектеп ғимаратын жаңғырту",
    description:
      "Алматы қаласындағы №123 мектеп ғимаратын толық жаңғырту жұмыстары",
    budget: 350000000,
    deadline: "2024-03-15",
    status: "open",
    category: "Құрылыс",
    createdAt: "2023-06-10",
    company: "Алматы қаласы әкімдігі",
    location: "Алматы, Қазақстан",
    requirements: [
      "Құрылыс лицензиясы",
      "Білім беру нысандарын салу тәжірибесі",
      "Жоба мерзімінде аяқтау мүмкіндігі",
    ],
    contact: "construction@almaty.gov.kz",
  },
  {
    id: 3,
    title: "Қоғамдық көлік жүйесін жаңарту",
    description:
      "Қарағанды қаласында автобус паркін жаңарту және көлік маршруттарын оңтайландыру",
    budget: 420000000,
    deadline: "2023-10-01",
    status: "closed",
    category: "Көлік және логистика",
    createdAt: "2023-04-20",
    company: "Қарағанды қаласы әкімдігі",
    location: "Қарағанды, Қазақстан",
    requirements: [
      "Көлік жүйелерін басқару тәжірибесі",
      "Логистикалық шешімдер тәжірибесі",
      "Жобаларды басқару сертификаты",
    ],
    contact: "transport@karaganda.gov.kz",
  },
  {
    id: 4,
    title: "Электронды денсаулық сақтау жүйесін құру",
    description:
      "Медициналық қызметтерді басқару және пациенттерді тіркеу үшін мобильді қосымша әзірлеу",
    budget: 120000000,
    deadline: "2024-01-15",
    status: "open",
    category: "IT және цифрландыру",
    createdAt: "2023-07-05",
    company: "Денсаулық сақтау министрлігі",
    location: "Астана, Қазақстан",
    requirements: [
      "Мобильді қосымшаларды әзірлеу тәжірибесі",
      "Медициналық ақпараттық жүйелерді білу",
      "Деректерді қорғау стандарттарын сақтау",
    ],
    contact: "healthit@gov.kz",
  },
  {
    id: 5,
    title: "Ауыл шаруашылығын қолдау бағдарламасын әзірлеу",
    description:
      "Ауыл шаруашылығы өндірісін жаңғырту және инновациялық технологияларды енгізу бағдарламасын әзірлеу",
    budget: 250000000,
    deadline: "2024-04-30",
    status: "open",
    category: "Ауыл шаруашылығы",
    createdAt: "2023-08-12",
    company: "Ауыл шаруашылығы министрлігі",
    location: "Астана, Қазақстан",
    requirements: [
      "Ауыл шаруашылығы саласындағы тәжірибе",
      "Мемлекеттік бағдарламаларды әзірлеу тәжірибесі",
      "Экономикалық талдау дағдылары",
    ],
    contact: "agri@gov.kz",
  },
];

export const mockUsers = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123",
    full_name: "Admin User",
    role: "admin",
    token: "mock-admin-token",
  },
  {
    id: 2,
    email: "user@example.com",
    password: "user123",
    full_name: "Regular User",
    role: "user",
    token: "mock-user-token",
  },
];

// Categories
export const categories = [
  "IT және цифрландыру",
  "Құрылыс",
  "Көлік және логистика",
  "Денсаулық сақтау",
  "Ауыл шаруашылығы",
  "Білім беру",
  "Экология",
  "Басқа",
];

// Statuses
export const statuses = ["open", "closed", "in_progress", "awarded"];
