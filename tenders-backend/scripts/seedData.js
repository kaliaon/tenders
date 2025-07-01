require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB, sequelize } = require("../config/db");
const User = require("../models/user.model");
const Tender = require("../models/tender.model");

// Mock data for tenders system
const mockTenders = [
  {
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

const mockUsers = [
  {
    email: "admin@example.com",
    password: "admin123",
    full_name: "Admin User",
    role: "admin",
  },
  {
    email: "user@example.com",
    password: "user123",
    full_name: "Regular User",
    role: "user",
  },
];

// Categories
const categories = [
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
const statuses = ["open", "closed", "in_progress", "awarded"];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync models with database (force: true will drop tables if they exist)
    console.log("Syncing database models...");
    await sequelize.sync({ force: true });
    console.log("Database synced!");

    // Create admin user first
    console.log("Creating users...");
    const users = await User.bulkCreate(mockUsers);
    console.log(`Created ${users.length} users`);

    // Create tenders with proper dates and link to admin user
    console.log("Creating tenders...");
    const tendersWithUser = mockTenders.map((tender) => ({
      ...tender,
      deadline: new Date(tender.deadline),
      createdAt: new Date(tender.createdAt),
      createdBy: users[0].id, // Associate with admin user
    }));

    const tenders = await Tender.bulkCreate(tendersWithUser);
    console.log(`Created ${tenders.length} tenders`);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
