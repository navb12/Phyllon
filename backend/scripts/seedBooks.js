const prisma = require('../src/config/prisma');

const BOOKS = [
  {
    title: "Piranesi",
    author: "Susanna Clarke",
    colors: ["#294638", "#122219"],
    moods: ["Haunted", "Wistful", "Hopeful"],
    description: "A man lives in an endless house of statues and tides, and keeps a very careful journal.",
    pageCount: 272
  },
  {
    title: "The Secret History",
    author: "Donna Tartt",
    colors: ["#6E2F26", "#2f1310"],
    moods: ["Haunted", "Restless"],
    description: "Six classics students, one decision they cannot take back.",
    pageCount: 559
  },
  {
    title: "Rebecca",
    author: "Daphne du Maurier",
    colors: ["#6A6944", "#26261a"],
    moods: ["Haunted", "Restless"],
    description: "The second Mrs de Winter walks through rooms still arranged for someone else.",
    pageCount: 380
  },
  {
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    colors: ["#B85F43", "#5a2616"],
    moods: ["Tender", "Wistful"],
    description: "An artificial friend watches closely and learns what devotion costs.",
    pageCount: 303
  },
  {
    title: "Circe",
    author: "Madeline Miller",
    colors: ["#35504F", "#14232a"],
    moods: ["Furious", "Hopeful"],
    description: "The witch of Aiaia tells her own side, one exile at a time.",
    pageCount: 393
  },
  {
    title: "The Remains of the Day",
    author: "Kazuo Ishiguro",
    colors: ["#6B5B4A", "#2c241c"],
    moods: ["Wistful", "Tender"],
    description: "A butler drives west and reviews a lifetime of quiet loyalty.",
    pageCount: 258
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    colors: ["#7A3B34", "#2c1512"],
    moods: ["Furious", "Hopeful"],
    description: "Reader, she did not simply marry him.",
    pageCount: 507
  },
  {
    title: "Station Eleven",
    author: "Emily St. John Mandel",
    colors: ["#3F5E4C", "#1a2b22"],
    moods: ["Cozy", "Hopeful", "Wistful"],
    description: "After the collapse, a travelling symphony insists that survival is not enough.",
    pageCount: 333
  }
];

async function seed() {
  console.log('Seeding initial books to database...');
  try {
    for (const book of BOOKS) {
      const existing = await prisma.book.findFirst({
        where: { title: book.title, author: book.author }
      });
      if (!existing) {
        await prisma.book.create({ data: book });
        console.log(`+ Added "${book.title}"`);
      } else {
        console.log(`= Already exists: "${book.title}"`);
      }
    }
    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

