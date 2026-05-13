import { db, collection, addDoc, serverTimestamp, getDocs, query, where } from "./firebase-config.js";

const newTerms = [
    // --- SPACE & UNIVERSE ---
    {
        category: 'astronomy',
        imageUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Black Hole', definition: 'A region of spacetime where gravity is so strong that nothing, including light, can escape. It is formed when a massive star collapses at the end of its life cycle.' },
            fr: { word: 'Trou Noir', definition: 'Une région de l\'espace-temps où la gravité est si forte que rien, même la lumière, ne peut s\'en échapper. Il se forme lors de l\'effondrement d\'une étoile massive.' },
            ar: { word: 'ثقب أسود', definition: 'منطقة في الزمكان تتميز بجاذبية قوية جداً لدرجة أن لا شيء، بما في ذلك الضوء، يمكنه الهروب منها. تتكون عند انهيار نجم ضخم.' },
            zgh: { word: 'ⵜⵉⵎⵥⵉⵜ ⵜⴰⴱⵔⴽⴰⵏⵜ', definition: 'ⴰⴷⵖⴰⵔ ⴷⴻⴳ ⵜⵓⵏⵏⴰ ⵢⵓⵎⴰⵏ ⵜⴰⴷⵓⵙⵉ ⵏ ⵓⵣⵓⵣⵣⴻⵍ ⵉⴳⴳⴻⵜⵏ.' }
        }
    },
    {
        category: 'astronomy',
        imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Supernova', definition: 'A powerful and luminous stellar explosion that occurs during the last evolutionary stages of a massive star, releasing as much energy as an entire galaxy.' },
            fr: { word: 'Supernova', definition: 'Une explosion stellaire puissante et lumineuse qui se produit lors des dernières étapes de l\'évolution d\'une étoile massive, libérant une énergie colossale.' },
            ar: { word: 'مستعر أعظم', definition: 'انفجار نجمي هائل ومضيء يحدث في المراحل الأخيرة من تطور نجم ضخم، يطلق طاقة تعادل طاقة مجرة كاملة.' },
            zgh: { word: 'ⵜⴰⵙⵓⴱⵉⵔⵏⵓⴼⴰ', definition: 'ⴰⴱⴱⵉⵢ ⴰⵎⵇⵔⴰⵏ ⵏ ⵢⵉⵜⵔⵉ ⴷⴻⴳ ⵜⵉⴳⵉⵔⴰ ⵏ ⵜⵓⴷⴷⵓⵔⵜ-ⵉⵙ.' }
        }
    },
    // --- CHEMISTRY ---
    {
        category: 'chemistry',
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf51ad4b69e?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Catalyst', definition: 'A substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change. It lowers the activation energy required.' },
            fr: { word: 'Catalyseur', definition: 'Une substance qui augmente la vitesse d\'une réaction chimique sans être elle-même consommée. Il abaisse l\'énergie d\'activation nécessaire.' },
            ar: { word: 'حفاز', definition: 'مادة تزيد من سرعة التفاعل الكيميائي دون أن تستهلك فيه. تعمل عن طريق خفض طاقة التنشيط اللازمة للتفاعل.' },
            zgh: { word: 'ⴰⴽⴰⵜⴰⵍⵉⵣⵓⵔ', definition: 'ⵜⴰⵏⴳⴰ ⵢⴻⵜⵜⴰⵣⵣⴰⵍⵏ ⵜⵉⴳⴰⵡⵜ ⵜⴰⴽⵉⵎⵉⴽⵜ.' }
        }
    },
    {
        category: 'chemistry',
        imageUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Covalent Bond', definition: 'A chemical bond that involves the sharing of electron pairs between atoms, creating a stable balance of attractive and repulsive forces.' },
            fr: { word: 'Liaison Covalente', definition: 'Une liaison chimique consistant en le partage de paires d\'électrons entre atomes, créant un équilibre stable entre les forces d\'attraction et de répulsion.' },
            ar: { word: 'رابطة تساهمية', definition: 'رابطة كيميائية تتضمن مشاركة أزواج من الإلكترونات بين الذرات، مما يخلق توازناً مستقراً للقوى.' },
            zgh: { word: 'ⵜⵓⵇⵇⵏⴰ ⵜⴰⴽⵓⴼⴰⵍⴰⵏⵜ', definition: 'ⵜⵓⵇⵇⵏⴰ ⵜⴰⴽⵉⵎⵉⴽⵜ ⵢⴻⵜⵜⵉⵍⵉⵏ ⵙ ⵓⴱⴰⵟⵟⵓ ⵏ ⵢⵉⵍⵉⴽⵜⵔⵓⵏⵏ.' }
        }
    },
    // --- PHYSICS ---
    {
        category: 'physics',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Entropy', definition: 'A thermodynamic property representing the unavailability of a system\'s thermal energy for conversion into mechanical work; often interpreted as disorder or randomness.' },
            fr: { word: 'Entropie', definition: 'Une propriété thermodynamique représentant l\'indisponibilité de l\'énergie thermique d\'un système pour être convertie en travail ; souvent interprétée comme le désordre.' },
            ar: { word: 'إنتروبيا', definition: 'خاصية ديناميكية حرارية تمثل مقدار الطاقة الحرارية غير المتوفرة للتحول إلى شغل ميكانيكي؛ غالباً ما تفسر على أنها مقياس للفوضى.' },
            zgh: { word: 'ⵜⴰⵏⵜⵔⵓⴱⵉⵜ', definition: 'ⵜⴰⵎⴳⴰ ⵜⴰⴷⵉⵏⴰⵎⵉⴽⵜ ⵢⴻⵜⵜⵎⴰⵍⴰⵏ ⴰⵔⵡⴰⵢ ⴷⴻⴳ ⵓⵏⴳⵔⴰⵡ.' }
        }
    },
    {
        category: 'physics',
        imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Quantum Entanglement', definition: 'A phenomenon where particles become linked such that the state of one instantly influences the state of the other, regardless of the distance between them.' },
            fr: { word: 'Intrication Quantique', definition: 'Un phénomène où des particules deviennent liées de sorte que l\'état de l\'une influence instantanément l\'état de l\'autre, quelle que soit la distance.' },
            ar: { word: 'تشابك كمي', definition: 'ظاهرة فيزيائية ترتبط فيها الجسيمات بحيث تؤثر حالة أحدها فوراً على حالة الآخر، بغض النظر عن المسافة بينهما.' },
            zgh: { word: 'ⴰⵛⴻⴱⴱⴻⴽ ⴰⴽⵓⵏⵜⵉⴽ', definition: 'ⵜⴰⵎⴰⴳⵉⵜ ⵜⴰⴼⵉⵣⵉⴽⵜ ⵢⴻⵜⵜⵇⵇⵉⵏⴻⵏ ⵜⵉⴼⵓⵍⵉⵏ ⵏ ⵜⵓⴷⴷⵓⵔⵜ.' }
        }
    },
    {
        category: 'physics',
        imageUrl: 'img/fusion-nucleaire.mp4',
        translations: {
            en: { word: 'Nuclear Fusion', definition: 'A reaction in which two or more atomic nuclei are combined to form one or more different atomic nuclei and subatomic particles. The difference in mass between the reactants and products is released as energy.' },
            fr: { word: 'Fusion Nucléaire', definition: 'Une réaction dans laquelle deux ou plusieurs noyaux atomiques s\'unissent pour former un noyau plus lourd. Ce processus libère une quantité massive d\'énergie, comme dans le Soleil.' },
            ar: { word: 'اندماج نووي', definition: 'تفاعل تتحد فيه نواتان ذريتان أو أكثر لتكوين نواة واحدة أثقل، مما يؤدي إلى إطلاق كميات هائلة من الطاقة.' },
            zgh: { word: 'ⴰⵙⵎⵓⴷⴷⴻⴳ ⴰⵡⵎⵎⴰⵙ', definition: 'ⵜⴰⵎⴰⴳⵉⵜ ⵏ ⵓⵙⵎⵓⴷⴷⴻⴳ ⵏ ⵡⵓⵎⵎⴰⵙⴻⵏ ⵏ ⵡⴰⵟⵓⵎ.' }
        }
    },
    // --- BIOLOGY ---
    {
        category: 'biology',
        imageUrl: 'https://images.unsplash.com/photo-1579154273821-ad99edf5ad89?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'CRISPR', definition: 'A revolutionary gene-editing technology that allows scientists to precisely alter DNA sequences and modify gene function within living organisms.' },
            fr: { word: 'CRISPR', definition: 'Une technologie révolutionnaire d\'édition génomique qui permet de modifier précisément les séquences d\'ADN et la fonction des gènes.' },
            ar: { word: 'كريسبر', definition: 'تقنية ثورية لتعديل الجينات تسمح للعلماء بتعديل تسلسلات الحمض النووي بدقة وتغيير وظيفة الجينات.' },
            zgh: { word: 'ⵛⵔⵉⵙⵒⵔ', definition: 'ⵜⴰⵜⵉⴽⵏⵓⵍⵓⵊⵉⵜ ⵢⴻⵜⵜⴱⴻⴷⴷⵉⵍⵏ ⵉⴳⵉⵏⵏ.' }
        }
    },
    {
        category: 'biology',
        imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Biodiversity', definition: 'The variety of life in the world or in a particular habitat or ecosystem, essential for ecological stability and resilience.' },
            fr: { word: 'Biodiversité', definition: 'La variété de la vie dans le monde ou dans un habitat particulier, essentielle à la stabilité et à la résilience des écosystèmes.' },
            ar: { word: 'تنوع بيولوجي', definition: 'تنوع الحياة في العالم أو في موطن معين، وهو أمر ضروري للاستقرار البيئي وقدرة النظم الحيوية على الصمود.' },
            zgh: { word: 'ⵜⴰⴳⴻⵜⵎⴰⴳⵉⵜ', definition: 'ⵜⴰⴳⴻⵜ ⵏ ⵜⵓⴷⴷⵓⵔⵜ ⴷⴻⴳ ⵢⵉⵡⴻⵏ ⵓⴷⵖⴰⵔ.' }
        }
    },
    // --- FAUNA ---
    {
        category: 'fauna',
        imageUrl: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Blue Whale', definition: 'The largest animal ever known to have existed, a marine mammal belonging to the baleen whales that can reach up to 30 meters in length.' },
            fr: { word: 'Baleine Bleue', definition: 'Le plus grand animal connu ayant jamais existé, un mammifère marin pouvant atteindre 30 mètres de long.' },
            ar: { word: 'حوت أزرق', definition: 'أضخم حيوان عُرف على الإطلاق، وهو ثديي بحري ينتمي إلى الحيتان البالينية ويمكن أن يصل طوله إلى 30 متراً.' },
            zgh: { word: 'ⴰⵣⴻⴳⵣⴰⵡ', definition: 'ⴰⵎⵓⴷⴰⵔ ⴰⵎⵇⵔⴰⵏ ⴷⴻⴳ ⵢⵉⵍⴻⵍ.' }
        }
    },
    {
        category: 'fauna',
        imageUrl: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Chameleon', definition: 'A specialized clade of lizards with the ability to change skin color, zygodactylous feet, and highly mobile independently rotating eyes.' },
            fr: { word: 'Caméléon', definition: 'Un lézard spécialisé capable de changer de couleur de peau, doté d\'yeux pivotant indépendamment et d\'une langue projectile.' },
            ar: { word: 'حرباء', definition: 'نوع من السحالي يتميز بقدرته على تغيير لون جلده، وامتلاكه لعيون تتحرك بشكل مستقل وللسان طويل لاصطياد الفرائس.' },
            zgh: { word: 'ⵜⴰⵜⴰ', definition: 'ⴰⵎⵓⴷⴰⵔ ⵢⴻⵜⵜⴱⴻⴷⴷⵉⵍⵏ ⴰⴽⵯⵍⵓ-ⵉⵙ.' }
        }
    },
    // --- FLORA & PLANTS ---
    {
        category: 'flora',
        imageUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Sequoia', definition: 'A genus of redwood coniferous trees containing the largest and tallest trees in the world, known for their massive trunks and long lifespan.' },
            fr: { word: 'Séquoia', definition: 'Un genre de conifères comprenant les arbres les plus grands et les plus massifs du monde, célèbres pour leur longévité exceptionnelle.' },
            ar: { word: 'سيكويا', definition: 'جنس من الأشجار الصنوبرية يضم أضخم وأطول الأشجار في العالم، وتشتهر بجذوعها الهائلة وعمرها الطويل.' },
            zgh: { word: 'ⴰⵙⵉⴽⵓⵢⴰ', definition: 'ⴰⵙⴻⴽⵍⵓ ⴰⵎⵇⵔⴰⵏ ⵢⴻⵜⵜⵉⴷⵉⵔⴻⵏ ⴰⵟⵟⴰⵙ.' }
        }
    },
    {
        category: 'plants',
        imageUrl: 'https://images.unsplash.com/photo-1596723048457-5502ca52310a?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Venus Flytrap', definition: 'A carnivorous plant native to subtropical wetlands that catches its prey—chiefly insects and arachnids—with a trapping structure formed by the terminal portion of each leaf.' },
            fr: { word: 'Dionée Attrape-mouche', definition: 'Une plante carnivore capable de capturer des insectes grâce à ses feuilles en forme de mâchoires qui se referment instantanément.' },
            ar: { word: 'خناق الذباب', definition: 'نبات آكل للحوم يصطاد فرائسه، وخاصة الحشرات، باستخدام بنية محاصرة تتكون من الجزء الطرفي لكل ورقة.' },
            zgh: { word: 'ⵜⴰⵎⴻⴳⵔⴰ ⵏ ⵢⵉⵣⵉ', definition: 'ⵜⴰⴳⵍⴷⵉⵡⵜ ⵢⴻⵜⵜⴻⵜⵜⴻⵏ ⵉⴱⴰⵅⵓⵛⵏ.' }
        }
    },
    // --- GEOLOGY ---
    {
        category: 'geology',
        imageUrl: 'https://images.unsplash.com/photo-1541411191165-f184eaf9509a?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Tectonic Plates', definition: 'Massive, irregularly shaped slabs of solid rock that make up the Earth\'s lithosphere and move relative to each other, causing earthquakes and volcanoes.' },
            fr: { word: 'Plaques Tectoniques', definition: 'De vastes plaques de roche solide qui composent la lithosphère terrestre et dont les mouvements sont responsables des séismes et du volcanisme.' },
            ar: { word: 'صفائح تكتونية', definition: 'أجزاء ضخمة غير منتظمة الشكل من الصخور الصلبة التي تشكل الغلاف الصخري للأرض وتتحرك بالنسبة لبعضها البعض.' },
            zgh: { word: 'ⵜⵉⴼⵉⵍⵉⵏ ⵜⵉⵜⵉⴽⵜⵓⵏⵉⴽⵉⵏ', definition: 'ⵜⵉⴼⵉⵍⵉⵏ ⵏ ⵓⵥⵔⵓ ⵢⴻⵜⵜⵎⵓⵙⵙⵓⵏ ⴷⴻⴳ ⵡⴰⴷⴷⴰⵢ ⵏ ⵡⴰⴽⴰⵍ.' }
        }
    },
    // --- MATHEMATICS ---
    {
        category: 'mathematics',
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd482195e?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Fibonacci Sequence', definition: 'A series of numbers in which each number is the sum of the two preceding ones, often found in nature like in sunflower patterns or shells.' },
            fr: { word: 'Suite de Fibonacci', definition: 'Une suite de nombres où chaque terme est la somme des deux précédents. Elle se retrouve fréquemment dans la nature (fleurs, coquillages).' },
            ar: { word: 'متتالية فيبوناتشي', definition: 'سلسلة من الأعداد حيث يكون كل عدد هو مجموع العددين السابقين له، وغالباً ما توجد في أنماط الطبيعة.' },
            zgh: { word: 'ⵜⴰⴳⵔⵓⵎⵎⴰ ⵏ ⴼⵉⴱⵓⵏⴰⵜⵛⵉ', definition: 'ⵜⴰⴳⵔⵓⵎⵎⴰ ⵏ ⵢⵉⵎⴹⴰⵏⴻⵏ ⵢⴻⵜⵜⵎⴰⵔⴰⵏ.' }
        }
    },
    // --- TECHNOLOGY ---
    {
        category: 'computer_science',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Artificial Intelligence', definition: 'The simulation of human intelligence processes by machines, especially computer systems, including learning, reasoning, and self-correction.' },
            fr: { word: 'Intelligence Artificielle', definition: 'La simulation des processus d\'intelligence humaine par des machines, notamment les systèmes informatiques.' },
            ar: { word: 'ذكاء اصطناعي', definition: 'محاكاة عمليات الذكاء البشري بواسطة الآلات، وخاصة أنظمة الكمبيوتر، بما في ذلك التعلم والاستدلال.' },
            zgh: { word: 'ⵜⴰⵎⵓⵙⵏⵉ ⵜⴰⵙⵏⵓⵍⴼⴰⵏⵜ', definition: 'ⵜⴰⵎⵓⵙⵏⵉ ⵏ ⵜⵎⴰⴽⵉⵏⵉⵏ.' }
        }
    },
    // --- MORE BIOLOGY ---
    {
        category: 'biology',
        imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Enzyme', definition: 'Biological molecules (typically proteins) that significantly speed up the rate of virtually all of the chemical reactions that take place within cells.' },
            fr: { word: 'Enzyme', definition: 'Des molécules biologiques (généralement des protéines) qui accélèrent considérablement les réactions chimiques au sein des cellules.' },
            ar: { word: 'إنزيم', definition: 'جزيئات بيولوجية (بروتينات عادة) تسرع بشكل كبير معدل جميع التفاعلات الكيميائية التي تحدث داخل الخلايا.' },
            zgh: { word: 'ⵍⴰⵏⵣⵉⵎ', definition: 'ⵜⵉⵎⵓⵍⵉⴽⵓⵍⵉⵏ ⵜⵉⴱⵢⵓⵍⵓⵊⵉⴽⵉⵏ.' }
        }
    },
    // --- MORE PHYSICS ---
    {
        category: 'physics',
        imageUrl: 'https://images.unsplash.com/photo-1534991715367-0c33403b38c3?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Superconductivity', definition: 'A state of matter in which a material can conduct electricity with zero resistance and expel magnetic fields when cooled below a critical temperature.' },
            fr: { word: 'Supraconductivité', definition: 'Un état de la matière où un matériau conduit l\'électricité sans aucune résistance et expulse les champs magnétiques à très basse température.' },
            ar: { word: 'موصلية فائقة', definition: 'حالة من المادة يمكن فيها للمادة توصيل الكهرباء دون مقاومة وطرد المجالات المغناطيسية عند تبريدها.' },
            zgh: { word: 'ⵜⴰⵙⵓⴱⵉⵔⴽⵓⵏⴷⵓⴽⵜⵉⴼⵉⵜⵉ', definition: 'ⴰⴷⴷⴰⴷ ⵏ ⵜⴰⵏⴳⴰ ⵓⵔ ⵢⴻⵜⵜⵇⴰⵡⴰⵎⴻⵏ ⵜⵔⵉⴽⵜⵉⵙⵉⵜ.' }
        }
    },
    // --- MORE ASTRONOMY ---
    {
        category: 'astronomy',
        imageUrl: 'https://images.unsplash.com/photo-1464802686167-b939a67a06f1?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Quasar', definition: 'An extremely luminous active galactic nucleus, in which a supermassive black hole is surrounded by a gaseous accretion disk, releasing massive energy.' },
            fr: { word: 'Quasar', definition: 'Un noyau galactique actif extrêmement lumineux, alimenté par un trou noir supermassif qui libère une énergie phénoménale.' },
            ar: { word: 'نجم زائف', definition: 'نواة مجرية نشطة ومضيئة للغاية، يحيط فيها ثقب أسود هائل بقرص تراكمي غازي، مما يطلق طاقة هائلة.' },
            zgh: { word: 'ⴰⴽⵡⴰⵣⴰⵔ', definition: 'ⴰⵎⵎⴰⵙ ⵏ ⵜⴳⴰⵍⴰⴽⵙⵉⵜ ⵢⴻⵔⵖⴰⵏ ⴰⵟⵟⴰⵙ.' }
        }
    },
    // --- MORE FAUNA ---
    {
        category: 'fauna',
        imageUrl: 'https://images.unsplash.com/photo-1590273466070-40c466b4432c?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Wolf', definition: 'A large wild canine of North America and Eurasia, known for its social structure and hunting in packs.' },
            fr: { word: 'Loup', definition: 'Un grand canidé sauvage connu pour sa structure sociale complexe et sa chasse en meutes.' },
            ar: { word: 'ذئب', definition: 'حيوان بري كبير من فصيلة الكلبيات، معروف ببنيته الاجتماعية والصيد في جماعات.' },
            zgh: { word: 'ⵓⵛⵛⴻⵏ', definition: 'ⴰⵎⵓⴷⴰⵔ ⴰⵎⵛⵓⵎ ⵢⴻⵜⵜⵉⴷⵉⵔⴻⵏ ⴷⴻⴳ ⵜⴰⴳⴰⵏⵜ.' }
        }
    },
    // --- MORE FLORA ---
    {
        category: 'flora',
        imageUrl: 'https://images.unsplash.com/photo-1597420498493-98443971f032?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Sunflower', definition: 'A tall North American plant with very large golden-rayed flowers, cultivated for its edible seeds and oil.' },
            fr: { word: 'Tournesol', definition: 'Une grande plante dont la fleur se tourne vers le soleil, cultivée pour ses graines et son huile.' },
            ar: { word: 'دوار الشمس', definition: 'نبات طويل له أزهار كبيرة ذهبية، يزرع من أجل بذوره الصالحة للأكل وزيته.' },
            zgh: { word: 'ⵜⴰⴼⵉⵔⴰ ⵏ ⵢⵉⵟⵉⵊ', definition: 'ⵜⴰⴳⵍⴷⵉⵡⵜ ⵢⴻⵜⵜⴻⴹⴼⴰⵔⵏ ⵉⵟⵉⵊ.' }
        }
    },
    // --- MORE GEOLOGY ---
    {
        category: 'geology',
        imageUrl: 'https://images.unsplash.com/photo-1525930337033-66236b856627?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Stalactite', definition: 'A tapering structure hanging like an icicle from the roof of a cave, formed of calcium salts deposited by dripping water.' },
            fr: { word: 'Stalactite', definition: 'Une formation calcaire qui pend du plafond d\'une grotte, formée par le dépôt de minéraux transportés par l\'eau.' },
            ar: { word: 'هابطة', definition: 'تكوين كلسي يتدلى كالمخروط من سقف الكهف، يتكون من أملاح الكالسيوم التي تترسب بفعل قطرات الماء.' },
            zgh: { word: 'ⵜⴰⵙⵜⴰⵍⴰⴽⵜⵉⵜ', definition: 'ⴰⵥⵔⵓ ⵢⴻⵜⵜⴷⵓⴷⴷⵓⵏ ⵙⴻⴳ ⵓⴼⵍⵍⴰ ⵏ ⵜⵉⴼⵔⵉ.' }
        }
    },
    // --- MORE CHEMISTRY ---
    {
        category: 'chemistry',
        imageUrl: 'https://images.unsplash.com/photo-1532634896-26909d0d4b89?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Polymer', definition: 'A substance that has a molecular structure consisting chiefly or entirely of a large number of similar units bonded together.' },
            fr: { word: 'Polymère', definition: 'Une substance dont la structure moléculaire est composée d\'un grand nombre d\'unités similaires liées entre elles.' },
            ar: { word: 'بوليمر', definition: 'مادة لها بنية جزيئية تتكون أساساً أو كلياً من عدد كبير من الوحدات المماثلة المرتبطة ببعضها البعض.' },
            zgh: { word: 'ⴰⴱⵓⵍⵉⵎⵉⵔ', definition: 'ⵜⴰⵏⴳⴰ ⵢⵓⵎⴰⵏ ⴰⵟⵟⴰⵙ ⵏ ⵜⴼⵓⵍⵉⵏ ⵢⴻⵎⵛⴰⴱⵉⵏ.' }
        }
    },
    // --- MOROCCAN CURRICULUM (PC / SVT) ---
    {
        category: 'biology',
        imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'ATP', definition: 'Adenosine Triphosphate, the primary energy carrier in all living organisms, produced during cellular respiration.' },
            fr: { word: 'ATP', definition: 'L\'Adénosine Triphosphate, la molécule universelle de l\'énergie dans les cellules vivantes, produite lors de la respiration cellulaire.' },
            ar: { word: 'أدينوزين ثلاثي الفوسفات', definition: 'الجزيئة العضوية المسؤولة عن تخزين ونقل الطاقة داخل الخلايا الحية.' },
            zgh: { word: 'ⴰⵜⵒ', definition: 'ⵜⴰⵎⵓⵍⵉⴽⵓⵍⵜ ⵏ ⵜⴼⴰⵙⵜ.' }
        }
    },
    {
        category: 'physics',
        imageUrl: 'https://images.unsplash.com/photo-1502675135487-e75f02194a21?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Mechanical Waves', definition: 'The propagation of a disturbance through a material medium without any actual transport of matter.' },
            fr: { word: 'Ondes Mécaniques', definition: 'Le phénomène de propagation d\'une perturbation dans un milieu matériel sans transport de matière.' },
            ar: { word: 'الموجات الميكانيكية', definition: 'ظاهرة انتشار اضطراب في وسط مادي مرن دون انتقال للمادة.' },
            zgh: { word: 'ⵜⵉⵎⵓⵔⵉⵡⵉⵏ ⵜⵉⵎⵉⴽⴰⵏⵉⴽⵉⵏ', definition: 'ⵜⴰⵎⴰⴳⵉⵜ ⵏ ⵓⵣⵓⵣⵣⴻⵍ ⵏ ⵓⵔⵡⴰⵢ.' }
        }
    },
    {
        category: 'physics',
        imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Radioactivity', definition: 'The spontaneous emission of radiation from the nucleus of an unstable atom.' },
            fr: { word: 'Radioactivité', definition: 'Le phénomène physique par lequel des noyaux atomiques instables se transforment spontanément en dégageant de l\'énergie.' },
            ar: { word: 'النشاط الإشعاعي', definition: 'تحول تلقائي لنوى ذرات غير مستقرة إلى نوى أخرى مع انبعاث إشعاعات طاقية.' },
            zgh: { word: 'ⵜⴰⵔⴰⴷⵢⵓⴽⵜⵉⴼⵉⵜⵉ', definition: 'ⴰⵣⵏⵣⴰⵔ ⵏ ⵜⴼⴰⵙⵜ ⵙⴻⴳ ⵡⵓⵎⵎⴰⵙ ⵏ ⵜⴼⵓⵍⵜ.' }
        }
    },
    {
        category: 'biology',
        imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Genetics', definition: 'The study of heredity and the variation of inherited characteristics in living organisms.' },
            fr: { word: 'Génétique', definition: 'La science qui étudie l\'hérédité et la transmission des caractères des parents aux descendants.' },
            ar: { word: 'علم الوراثة', definition: 'العلم الذي يدرس انتقال الصفات الوراثية من الآباء إلى الأبناء والقوانين المتحكمة في ذلك.' },
            zgh: { word: 'ⵜⴰⵊⵉⵏⵉⵜⵉⴽⵜ', definition: 'ⵜⵓⵙⵙⵏⴰ ⵏ ⵓⴼⴻⵔⵙⴻⵢ ⵏ ⵜⴼⵔⴰⵙ.' }
        }
    },
    {
        category: 'biology',
        imageUrl: 'img/genome.jfif',
        translations: {
            en: { word: 'Genome', definition: 'The complete set of genetic material (DNA) present in an organism or cell, containing all the information needed to build and maintain that organism.' },
            fr: { word: 'Génome', definition: 'L\'ensemble complet du matériel génétique (ADN) d\'un organisme ou d\'une cellule, contenant toutes les instructions nécessaires à son développement.' },
            ar: { word: 'جينوم', definition: 'المجموعة الكاملة من المادة الوراثية (DNA) الموجودة في كائن حي أو خلية، والتي تحتوي على جميع المعلومات اللازمة لبناء هذا الكائن.' },
            zgh: { word: 'ⴰⵊⵉⵏⵓⵎ', definition: 'ⵜⴰⴳⵔⵓⵎⵎⴰ ⵏ ⵓⵎⴰⵜⵜⴰⵔ ⴰⵊⵉⵏⵉⵜⵉⴽ.' }
        }
    },
    {
        category: 'chemistry',
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf51ad4b69e?q=80&w=800&auto=format&fit=crop',
        translations: {
            en: { word: 'Chemical Equilibrium', definition: 'The state in which both reactants and products are present in concentrations which have no further tendency to change with time.' },
            fr: { word: 'Équilibre Chimique', definition: 'L\'état d\'un système chimique dans lequel les concentrations des réactifs et des produits ne varient plus au cours du temps.' },
            ar: { word: 'التوازن الكيميائي', definition: 'حالة للمجموعة الكيميائية حيث تبقى تراكيز المتفاعلات والنواتج ثابتة ولا تتغير مع الزمن.' },
            zgh: { word: 'ⵓⵎⵙⴰⵙⴰ ⴰⴽⵉⵎⵉⴽ', definition: 'ⴰⴷⴷⴰⴷ ⵏ ⵜⴼⵔⴰⵙ ⵜⵉⴽⵉⵎⵉⴽⵉⵏ.' }
        }
    }
    },
    {
        category: 'biology',
        imageUrl: 'PHOTOSYNTHESIS_ANIMATION',
        translations: {
            en: { word: 'Photosynthesis', definition: 'The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.' },
            fr: { word: 'Photosynthèse', definition: 'Le processus par lequel les plantes vertes synthétisent des matières organiques grâce à l\'énergie lumineuse, en absorbant le gaz carbonique et en libérant de l\'oxygène.' },
            ar: { word: 'التركيب الضوئي', definition: 'العملية التي تستخدم بها النباتات الخضراء وبعض الكائنات الأخرى ضوء الشمس لتصنيع العناصر الغذائية من ثاني أكسيد الكربون والماء.' },
            zgh: { word: 'ⴰⴼⴰⵔⴻⵙ ⴰⴼⵓⵜⵓⵏⵉ', definition: 'ⵜⴰⵎⴰⴳⵉⵜ ⵢⴻⵜⵜⴰⵊⵊⴰⵏ ⵜⵉⴳⵍⴷⵉⵡⵉⵏ ⵜⵉⵣⴻⴳⵣⴰⵡⵉⵏ ⴰⴷ ⴼⴰⵔⵙⵏⵜ ⵜⴰⴼⴰⵙⵜ.' }
        }
    }
];

export async function seedNewData() {
    console.log("Fetching existing words to avoid duplicates...");
    const snapshot = await getDocs(collection(db, "words"));
    const existingWords = new Set();
    
    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.translations?.en?.word) {
            existingWords.add(data.translations.en.word.toLowerCase());
        }
    });

    console.log(`Found ${existingWords.size} existing terms.`);
    console.log("Starting to seed unique new terms with enriched definitions...");

    let addedCount = 0;
    let skippedCount = 0;

    for (const term of newTerms) {
        const enWord = term.translations.en.word.toLowerCase();
        
        if (existingWords.has(enWord)) {
            console.log(`Skipping duplicate: ${term.translations.en.word}`);
            skippedCount++;
            continue;
        }

        try {
            await addDoc(collection(db, "words"), {
                ...term,
                status: 'approved',
                author: 'system@demo.com',
                createdAt: serverTimestamp()
            });
            console.log(`Added: ${term.translations.en.word}`);
            existingWords.add(enWord);
            addedCount++;
        } catch (e) {
            console.error(`Error adding ${term.translations.en.word}:`, e);
        }
    }

    console.log(`--- Seeding Complete ---`);
    console.log(`Successfully added: ${addedCount}`);
    console.log(`Skipped (duplicates): ${skippedCount}`);
}
