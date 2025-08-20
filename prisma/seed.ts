import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Korean language
  const koreanLanguage = await prisma.language.upsert({
    where: { code: 'ko-KR' },
    update: {},
    create: {
      code: 'ko-KR',
      name: 'Korean',
      rtl: false,
    },
  });

  console.log('✅ Created Korean language');

  // Create South Korea map
  const southKoreaMap = await prisma.map.upsert({
    where: { languageId: koreanLanguage.id },
    update: {},
    create: {
      languageId: koreanLanguage.id,
      name: 'South Korea',
      svgPathUrl: '/maps/south-korea.svg',
      orderIndex: 1,
    },
  });

  console.log('✅ Created South Korea map');

  // Create stations
  const stations = await Promise.all([
    prisma.station.upsert({
      where: { 
        mapId_orderIndex: { 
          mapId: southKoreaMap.id, 
          orderIndex: 1 
        } 
      },
      update: {},
      create: {
        mapId: southKoreaMap.id,
        name: 'Seoul Station',
        description: 'Learn essential greetings and basic phrases in the heart of Korea',
        orderIndex: 1,
        isLockedByDefault: false, // First station is unlocked
        positionX: 200,
        positionY: 150,
      },
    }),
    prisma.station.upsert({
      where: { 
        mapId_orderIndex: { 
          mapId: southKoreaMap.id, 
          orderIndex: 2 
        } 
      },
      update: {},
      create: {
        mapId: southKoreaMap.id,
        name: 'Busan Station',
        description: 'Master common expressions and useful phrases',
        orderIndex: 2,
        isLockedByDefault: true,
        positionX: 400,
        positionY: 300,
      },
    }),
    prisma.station.upsert({
      where: { 
        mapId_orderIndex: { 
          mapId: southKoreaMap.id, 
          orderIndex: 3 
        } 
      },
      update: {},
      create: {
        mapId: southKoreaMap.id,
        name: 'Jeju Station',
        description: 'Explore cultural expressions and advanced vocabulary',
        orderIndex: 3,
        isLockedByDefault: true,
        positionX: 150,
        positionY: 450,
      },
    }),
  ]);

  console.log('✅ Created stations');

  // Create Korean words
  const koreanWords = [
    {
      lemma: '안녕하세요',
      phonetic: 'annyeonghaseyo',
      translationHe: 'שלום',
      translationEn: 'Hello',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '안녕하세요! 처음 뵙겠습니다.',
      exampleTranslationHe: 'שלום! נעים להכיר.',
    },
    {
      lemma: '감사합니다',
      phonetic: 'gamsahamnida',
      translationHe: 'תודה',
      translationEn: 'Thank you',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '정말 감사합니다.',
      exampleTranslationHe: 'תודה רבה.',
    },
    {
      lemma: '네',
      phonetic: 'ne',
      translationHe: 'כן',
      translationEn: 'Yes',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '네, 맞습니다.',
      exampleTranslationHe: 'כן, נכון.',
    },
    {
      lemma: '아니요',
      phonetic: 'aniyo',
      translationHe: 'לא',
      translationEn: 'No',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '아니요, 그렇지 않습니다.',
      exampleTranslationHe: 'לא, זה לא נכון.',
    },
    {
      lemma: '물',
      phonetic: 'mul',
      translationHe: 'מים',
      translationEn: 'Water',
      partOfSpeech: 'NOUN',
      exampleNative: '물을 마시고 싶어요.',
      exampleTranslationHe: 'אני רוצה לשתות מים.',
    },
    {
      lemma: '화장실',
      phonetic: 'hwajangsil',
      translationHe: 'שירותים',
      translationEn: 'Bathroom',
      partOfSpeech: 'NOUN',
      exampleNative: '화장실이 어디에 있나요?',
      exampleTranslationHe: 'איפה השירותים?',
    },
    {
      lemma: '얼마예요?',
      phonetic: 'eolmayeyo?',
      translationHe: 'כמה זה?',
      translationEn: 'How much is it?',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '이것은 얼마예요?',
      exampleTranslationHe: 'כמה זה עולה?',
    },
    {
      lemma: '도와주세요',
      phonetic: 'dowajuseyo',
      translationHe: 'בבקשה עזרו לי',
      translationEn: 'Please help me',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '도와주세요!',
      exampleTranslationHe: 'בבקשה עזרו לי!',
    },
    {
      lemma: '죄송합니다',
      phonetic: 'joesonghamnida',
      translationHe: 'סליחה/מצטער/ת',
      translationEn: 'I\'m sorry',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '죄송합니다, 늦었습니다.',
      exampleTranslationHe: 'סליחה, אני מאחר.',
    },
    {
      lemma: '사랑해요',
      phonetic: 'saranghaeyo',
      translationHe: 'אני אוהב/ת אותך',
      translationEn: 'I love you',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '엄마, 사랑해요!',
      exampleTranslationHe: 'אמא, אני אוהב אותך!',
    },
  ];

  const createdWords = await Promise.all(
    koreanWords.map((word) =>
      prisma.word.upsert({
        where: { 
          languageId_lemma: { 
            languageId: koreanLanguage.id, 
            lemma: word.lemma 
          } 
        },
        update: {},
        create: {
          languageId: koreanLanguage.id,
          ...word,
        },
      })
    )
  );

  console.log('✅ Created Korean words');

  // Create media assets for words
  const mediaAssets = await Promise.all([
    // Image assets
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/hello.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/hello.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Child waving hello',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/thank-you.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/thank-you.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Person saying thank you',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/yes.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/yes.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Thumbs up gesture',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/no.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/no.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Thumbs down gesture',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/water.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/water.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Glass of water',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/bathroom.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/bathroom.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Bathroom sign',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/how-much.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/how-much.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Price tag with question mark',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/help.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/help.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Person asking for help',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/sorry.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/sorry.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Person apologizing',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/love.webp' },
      update: {},
      create: {
        type: 'IMAGE',
        url: '/media/ko/love.webp',
        mime: 'image/webp',
        width: 400,
        height: 300,
        alt: 'Heart symbol',
      },
    }),

    // Audio assets
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/hello.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/hello.mp3',
        mime: 'audio/mpeg',
        durationMs: 2000,
        alt: 'Pronunciation of 안녕하세요',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/thank-you.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/thank-you.mp3',
        mime: 'audio/mpeg',
        durationMs: 2500,
        alt: 'Pronunciation of 감사합니다',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/yes.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/yes.mp3',
        mime: 'audio/mpeg',
        durationMs: 1000,
        alt: 'Pronunciation of 네',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/no.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/no.mp3',
        mime: 'audio/mpeg',
        durationMs: 1500,
        alt: 'Pronunciation of 아니요',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/water.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/water.mp3',
        mime: 'audio/mpeg',
        durationMs: 1200,
        alt: 'Pronunciation of 물',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/bathroom.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/bathroom.mp3',
        mime: 'audio/mpeg',
        durationMs: 3000,
        alt: 'Pronunciation of 화장실',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/how-much.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/how-much.mp3',
        mime: 'audio/mpeg',
        durationMs: 2000,
        alt: 'Pronunciation of 얼마예요?',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/help.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/help.mp3',
        mime: 'audio/mpeg',
        durationMs: 2500,
        alt: 'Pronunciation of 도와주세요',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/sorry.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/sorry.mp3',
        mime: 'audio/mpeg',
        durationMs: 3000,
        alt: 'Pronunciation of 죄송합니다',
      },
    }),
    prisma.mediaAsset.upsert({
      where: { url: '/media/ko/love.mp3' },
      update: {},
      create: {
        type: 'AUDIO',
        url: '/media/ko/love.mp3',
        mime: 'audio/mpeg',
        durationMs: 2000,
        alt: 'Pronunciation of 사랑해요',
      },
    }),
  ]);

  console.log('✅ Created media assets');

  // Create word-media relationships
  const wordMediaRelations = [
    // Hello
    { wordId: createdWords[0].id, mediaId: mediaAssets[0].id, role: 'IMAGE' },
    { wordId: createdWords[0].id, mediaId: mediaAssets[10].id, role: 'PRONUNCIATION' },
    
    // Thank you
    { wordId: createdWords[1].id, mediaId: mediaAssets[1].id, role: 'IMAGE' },
    { wordId: createdWords[1].id, mediaId: mediaAssets[11].id, role: 'PRONUNCIATION' },
    
    // Yes
    { wordId: createdWords[2].id, mediaId: mediaAssets[2].id, role: 'IMAGE' },
    { wordId: createdWords[2].id, mediaId: mediaAssets[12].id, role: 'PRONUNCIATION' },
    
    // No
    { wordId: createdWords[3].id, mediaId: mediaAssets[3].id, role: 'IMAGE' },
    { wordId: createdWords[3].id, mediaId: mediaAssets[13].id, role: 'PRONUNCIATION' },
    
    // Water
    { wordId: createdWords[4].id, mediaId: mediaAssets[4].id, role: 'IMAGE' },
    { wordId: createdWords[4].id, mediaId: mediaAssets[14].id, role: 'PRONUNCIATION' },
    
    // Bathroom
    { wordId: createdWords[5].id, mediaId: mediaAssets[5].id, role: 'IMAGE' },
    { wordId: createdWords[5].id, mediaId: mediaAssets[15].id, role: 'PRONUNCIATION' },
    
    // How much
    { wordId: createdWords[6].id, mediaId: mediaAssets[6].id, role: 'IMAGE' },
    { wordId: createdWords[6].id, mediaId: mediaAssets[16].id, role: 'PRONUNCIATION' },
    
    // Help
    { wordId: createdWords[7].id, mediaId: mediaAssets[7].id, role: 'IMAGE' },
    { wordId: createdWords[7].id, mediaId: mediaAssets[17].id, role: 'PRONUNCIATION' },
    
    // Sorry
    { wordId: createdWords[8].id, mediaId: mediaAssets[8].id, role: 'IMAGE' },
    { wordId: createdWords[8].id, mediaId: mediaAssets[18].id, role: 'PRONUNCIATION' },
    
    // Love
    { wordId: createdWords[9].id, mediaId: mediaAssets[9].id, role: 'IMAGE' },
    { wordId: createdWords[9].id, mediaId: mediaAssets[19].id, role: 'PRONUNCIATION' },
  ];

  await Promise.all(
    wordMediaRelations.map((relation) =>
      prisma.wordMedia.upsert({
        where: { 
          wordId_mediaId_role: { 
            wordId: relation.wordId, 
            mediaId: relation.mediaId, 
            role: relation.role 
          } 
        },
        update: {},
        create: relation,
      })
    )
  );

  console.log('✅ Created word-media relationships');

  // Create station-word relationships (first station with all 10 words)
  const stationWordRelations = createdWords.map((word, index) => ({
    stationId: stations[0].id,
    wordId: word.id,
    orderIndex: index + 1,
  }));

  await Promise.all(
    stationWordRelations.map((relation) =>
      prisma.stationWord.upsert({
        where: { 
          stationId_orderIndex: { 
            stationId: relation.stationId, 
            orderIndex: relation.orderIndex 
          } 
        },
        update: {},
        create: relation,
      })
    )
  );

  console.log('✅ Created station-word relationships');

  // Create characters
  const characters = await Promise.all([
    prisma.character.upsert({
      where: { name: 'Lead Character' },
      update: {},
      create: {
        name: 'Lead Character',
        spriteIdleUrl: '/characters/lead-idle.png',
        spriteWalkUrl: '/characters/lead-walk.png',
      },
    }),
    prisma.character.upsert({
      where: { name: 'Buddy Character' },
      update: {},
      create: {
        name: 'Buddy Character',
        spriteIdleUrl: '/characters/buddy-idle.png',
        spriteWalkUrl: '/characters/buddy-walk.png',
      },
    }),
  ]);

  console.log('✅ Created characters');

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: { code: 'FIRST_STATION' },
      update: {},
      create: {
        code: 'FIRST_STATION',
        name: 'First Steps',
        description: 'Complete your first learning station',
        iconUrl: '/achievements/first-station.png',
      },
    }),
    prisma.achievement.upsert({
      where: { code: 'PERFECT_SCORE' },
      update: {},
      create: {
        code: 'PERFECT_SCORE',
        name: 'Perfect Score',
        description: 'Get 100% on a station quiz',
        iconUrl: '/achievements/perfect-score.png',
      },
    }),
    prisma.achievement.upsert({
      where: { code: 'WORD_MASTER' },
      update: {},
      create: {
        code: 'WORD_MASTER',
        name: 'Word Master',
        description: 'Learn 50 words',
        iconUrl: '/achievements/word-master.png',
      },
    }),
  ]);

  console.log('✅ Created achievements');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - 1 language (Korean)`);
  console.log(`   - 1 map (South Korea)`);
  console.log(`   - 3 stations`);
  console.log(`   - 10 Korean words`);
  console.log(`   - 20 media assets`);
  console.log(`   - 2 characters`);
  console.log(`   - 3 achievements`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
