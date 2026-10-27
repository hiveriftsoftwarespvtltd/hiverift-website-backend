const mongoose = require('mongoose');

const uri = 'mongodb://rs5045280:xbpneTRReMJD9LAc@ac-qpd9k1n-shard-00-00.sbbouj5.mongodb.net:27017,ac-qpd9k1n-shard-00-01.sbbouj5.mongodb.net:27017,ac-qpd9k1n-shard-00-02.sbbouj5.mongodb.net:27017/Hiverift?ssl=true&replicaSet=atlas-45jbz5-shard-0&authSource=admin&retryWrites=true&w=majority';

// All images below are pre-verified HTTP 200 on Unsplash CDN
const imageLibrary = {
  // Web Development
  web_code: [
    'photo-1498050108023-c5249f4df085', // MacBook code desk
    'photo-1461749280684-dccba630e2f6', // Programming code screen
    'photo-1555066931-4365d14bab8c', // Code editor dark theme
    'photo-1517694712202-14dd9538aa97', // Laptop code with coffee
    'photo-1587620962725-abab7fe55159', // Dual monitor coding
    'photo-1542838132-92c53300491e', // HTML / CSS code
    'photo-1504639725590-34d0984388bd', // Modern code on dark screen
    'photo-1504384764586-bb4cdc1707b0', // Developer dual monitor setup
    'photo-1488590528505-98d2b5aba04b', // Modern tech screen
    'photo-1525547719571-a2d4ac8945e2', // Laptop on clean desk
  ],
  web_design: [
    'photo-1507238691740-187a5b1d37b8', // Web design workspace
    'photo-1547658719-da2b51169166', // Web design wireframe tablet
    'photo-1522542550221-31fd19575a2d', // UX wireframe paper sketch
    'photo-1487014679447-9f8336841d58', // Minimalist web agency desk
    'photo-1531403009284-440f080d1e12', // Responsive design wireframing
    'photo-1532619675605-1ede6c2ed2b0', // Creative notebook and wireframing
  ],
  web_ecommerce: [
    'photo-1556742049-0a67e5572263', // Modern payment & store checkout
    'photo-1522204523234-8729aa6e3d5f', // E-commerce online shopping interface
    'photo-1556740738-b6a63e27c4df', // E-commerce card payment
    'photo-1556742031-c6961e8560b0', // E-commerce retail counter
  ],
  web_tech_backend: [
    'photo-1515879218367-8466d910aaa4', // Python code syntax
    'photo-1526374965328-7f61d4dc18c5', // Matrix green cyber security
    'photo-1550751827-4bd374c3f58b', // Cyber security lock
    'photo-1519389950473-47ba0277781c', // Team writing web code
    'photo-1522071820081-009f0129c71c', // Startup developers collaborating
  ],

  // Tech & AI
  ai_general: [
    'photo-1677442136019-21780ecad995', // AI Neural network visualization
    'photo-1620712943543-bcc4688e7485', // AI brain digital graphic
    'photo-1535378917042-10a22c95931a', // Artificial intelligence robotic hand
    'photo-1509228468518-180dd4864904', // Machine learning algorithm
    'photo-1573164713988-8665fc963095', // AI data analytics
    'photo-1618005182384-a83a8bd57fbe', // Abstract futuristic waves
  ],
  cloud_infrastructure: [
    'photo-1558494949-ef010cbdcc31', // Cloud server room
    'photo-1544197150-b99a580bb7a8', // Server infrastructure cables
    'photo-1451187580459-43490279c0fa', // Global data network Earth
    'photo-1518770660439-4636190af475', // Microchip processor
    'photo-1563770660941-20978e870e26', // Futuristic fiber optic light
    'photo-1516321497487-e288fb19713f', // Digital security cloud
  ],
  tech_workflow: [
    'photo-1607799279861-4dd421887fb3', // Coding algorithm screen
    'photo-1504384308090-c894fdcc538d', // Dev workstation
    'photo-1531482615713-2afd69097998', // Tech team discussion
    'photo-1531297484001-80022131f5a1', // Futuristic laptop glow
    'photo-1517048676732-d65bc937f952', // Tech engineers conference
  ],

  // Mobile Apps
  mobile_app: [
    'photo-1512941937669-90a1b58e7e9c', // Hand holding iPhone
    'photo-1551650975-87deedd944c3', // Mobile phone with app screens
    'photo-1526406915894-7bcd65f60845', // Multiple phones on desk
    'photo-1555774698-0b77e0d5fac6', // App UI prototype on iPhone
    'photo-1581291518857-4e27b48ff24e', // Sketching mobile app UI
    'photo-1556656793-08538906a9f8', // Person using mobile app
    'photo-1563986768609-322da13575f3', // Mobile security app
    'photo-1607252650355-f7fd0460ccdb', // Android phone notification
    'photo-1522199755839-a2bacb67c546', // Designer working on tablet
    'photo-1517292987719-0369a794ec0f', // Mobile phone test lab
    'photo-1585060544812-6b45742d762f', // Mobile app development code
    'photo-1580927752452-89d86da3fa0a', // Mobile developer coding
    'photo-1563986768494-4dee2763ff3f', // Mobile payments and phone
  ],

  // SEO
  seo_search: [
    'photo-1571721795195-a2ca2d3370a9', // Search engine search bar
    'photo-1562577309-4932fdd64cd1', // SEO ranking growth chart
    'photo-1432888622747-4eb9a8efeb07', // SEO marketing strategy notes
    'photo-1572021335469-31706a17aaef', // Growth analytics team meeting
    'photo-1504868584819-f8e8b4b6d7e3', // Data analytics graphs
    'photo-1551288049-bebda4e38f71', // Traffic performance dashboard
    'photo-1543269865-cbf427effbad', // Collaborative ranking audit
    'photo-1454165804606-c3d57bc86b40', // Analytics report review
    'photo-1590402494682-cd3fb53b1f70', // Audit checklist
  ],

  // Digital Marketing
  marketing_social: [
    'photo-1611162617474-5b21e879e113', // Social media application icons
    'photo-1526470608268-f674ce90ebd4', // Social media notifications
    'photo-1616469829941-c7200edec809', // Social media engagement screen
    'photo-1534536281715-e28d76689b4d', // Customer outreach email
    'photo-1499750310107-5fef28a66643', // Content writing laptop
  ],
  marketing_campaign: [
    'photo-1533750349088-cd871a92f312', // Marketing strategy plan
    'photo-1557838923-2985c318be48', // Marketing meeting whiteboard
    'photo-1432888498266-38ffec3eaf0a', // Marketing coffee desk notepad
    'photo-1551836022-d5d88e9218df', // Campaign manager working
    'photo-1552664730-d307ca884978', // Marketing agency brainstorming
    'photo-1542744173-8e7e53415bb0', // Lead generation meeting
    'photo-1553877522-43269d4ea984', // Digital agency brainstorming
  ],

  // Business Growth
  business_strategy: [
    'photo-1552664730-d307ca884978', // Team brainstorming room
    'photo-1556761175-5973dc0f32e7', // Business partnership handshake
    'photo-1507679799987-c73779587ccf', // Corporate executive in suit
    'photo-1486406146926-c627a92ad1ab', // Modern corporate glass skyscraper
    'photo-1517245386807-bb43f82c33c4', // Modern team collaborating
    'photo-1522202176988-66273c2fd55f', // Team group discussion
    'photo-1531545514256-b1400bc00f31', // Women tech team meeting
    'photo-1497366216548-37526070297c', // Modern glass office interior
    'photo-1497215728101-856f4ea42174', // Minimalist workspace
    'photo-1557804506-669a67965ba0', // Modern conference room
    'photo-1551434678-e076c223a692', // Tech office workers
  ],
  business_finance: [
    'photo-1554224155-8d04cb21cd6c', // Accounting and financial calculations
    'photo-1542744094-3a31f272c490', // Business finance presentation
    'photo-1559526324-4b87b5e36e44', // Growth chart upward trend
    'photo-1556155092-490a1ba16284', // Business professional smartphone
    'photo-1521737604893-d14cc237f11d', // Company all-hands meeting
  ]
};

function formatUnsplash(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=800`;
}

// Track usage of each image to guarantee maximum variety
const usageTracker = {};

function pickImage(category, title) {
  const t = (title || '').toLowerCase();
  let pool = [];

  if (category === 'Web Development') {
    if (t.includes('shopify') || t.includes('ecommerce') || t.includes('cart') || t.includes('sell')) {
      pool = imageLibrary.web_ecommerce;
    } else if (t.includes('ui') || t.includes('design') || t.includes('interface') || t.includes('responsive')) {
      pool = imageLibrary.web_design;
    } else if (t.includes('backend') || t.includes('python') || t.includes('php') || t.includes('laravel') || t.includes('api') || t.includes('database') || t.includes('security') || t.includes('backup') || t.includes('saas') || t.includes('architecture')) {
      pool = imageLibrary.web_tech_backend;
    } else {
      pool = imageLibrary.web_code;
    }
  } else if (category === 'Tech & AI') {
    if (t.includes('cloud') || t.includes('server') || t.includes('hosting') || t.includes('database') || t.includes('infrastructure') || t.includes('hardware') || t.includes('blockchain') || t.includes('web3') || t.includes('pipeline')) {
      pool = imageLibrary.cloud_infrastructure;
    } else if (t.includes('ai') || t.includes('rag') || t.includes('chatbot') || t.includes('hallucination') || t.includes('model') || t.includes('fine-tuning') || t.includes('predictive') || t.includes('generative')) {
      pool = imageLibrary.ai_general;
    } else {
      pool = imageLibrary.tech_workflow;
    }
  } else if (category === 'Mobile Apps') {
    pool = imageLibrary.mobile_app;
  } else if (category === 'SEO') {
    pool = imageLibrary.seo_search;
  } else if (category === 'Digital Marketing') {
    if (t.includes('social') || t.includes('email') || t.includes('newsletter') || t.includes('content') || t.includes('retention')) {
      pool = imageLibrary.marketing_social;
    } else {
      pool = imageLibrary.marketing_campaign;
    }
  } else if (category === 'Business Growth') {
    if (t.includes('cost') || t.includes('cac') || t.includes('ltv') || t.includes('value') || t.includes('finance') || t.includes('roi') || t.includes('pricing') || t.includes('budget')) {
      pool = imageLibrary.business_finance;
    } else {
      pool = imageLibrary.business_strategy;
    }
  } else {
    pool = imageLibrary.web_code;
  }

  // Sort pool by least used
  pool.sort((a, b) => {
    const countA = usageTracker[a] || 0;
    const countB = usageTracker[b] || 0;
    return countA - countB;
  });

  const chosenId = pool[0];
  usageTracker[chosenId] = (usageTracker[chosenId] || 0) + 1;
  return formatUnsplash(chosenId);
}

async function run() {
  await mongoose.connect(uri);
  const collection = mongoose.connection.collection('blogs');

  // Find all blogs whose image needs fixing (starts with blog-, uploads/, empty, null, or is not https)
  const blogsToFix = await collection.find({
    $or: [
      { image: { $regex: '^blog-' } },
      { image: { $regex: '^uploads/' } },
      { image: '' },
      { image: null },
      { image: { $not: { $regex: '^https?://' } } }
    ]
  }).toArray();

  console.log(`Found ${blogsToFix.length} blogs to update in MongoDB Atlas.`);

  let updatedCount = 0;
  for (const blog of blogsToFix) {
    const newImage = pickImage(blog.category, blog.title);
    await collection.updateOne(
      { _id: blog._id },
      { $set: { image: newImage, updatedAt: new Date() } }
    );
    updatedCount++;
  }

  console.log(`Successfully updated ${updatedCount} blogs with real Unsplash images!`);

  // Verify uniqueness and distribution
  const allBlogs = await collection.find({}, { projection: { image: 1, title: 1, category: 1 } }).toArray();
  const summary = {};
  for (const b of allBlogs) {
    summary[b.image] = (summary[b.image] || 0) + 1;
  }

  const uniqueImagesCount = Object.keys(summary).length;
  console.log(`Total blogs in DB: ${allBlogs.length}`);
  console.log(`Unique image URLs across all blogs: ${uniqueImagesCount}`);
  
  const maxUsage = Math.max(...Object.values(summary));
  console.log(`Maximum times any single image is used: ${maxUsage}`);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
