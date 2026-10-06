// ✦ MAKE THIS LITTLE WORLD YOURS ✦
// Change the words here. Everything personal lives in this one file.
// PHOTO GUIDE: Put your pictures in assets/, then replace each `src` below
// with './assets/your-photo.jpg'. Portrait photos look best in the hero.
// The included photographs are mood-board placeholders, not your memories.

export const content = {
  name: 'Phoebe Joy',
  fullName: 'Phoebe Joy P. Alcaraz',
  from: 'Jay',
  // Philippine time. Change the time too if you remember the exact moment.
  anniversary: '2023-12-17T00:00:00+08:00',
  anniversaryLabel: 'December 17, 2023',
  hero: {
    // ADD YOUR FAVORITE PHOTO OF YOU TWO HERE:
    src: './assets/hero.jpg',
    alt: 'Hands forming a heart in the golden evening light',
    // ADD A SECOND FAVORITE PHOTO HERE:
    smallSrc: './assets/sea.jpg',
    smallAlt: 'A quiet coast, a little inspiration for our next adventure',
  },
  story: [
    { date: 'Where it all began', title: 'Somehow, we found each other.',
      description: 'Out of all the people in this world, life brought me to you. I still think that is my favorite kind of magic.',
      // REPLACE WITH A PHOTO FROM YOUR FIRST DATE. Edit the date and memory above.
      src: './assets/coffee.jpg', alt: 'Coffee and slow mornings', caption: 'the beginning of everything' },
    { date: 'December 17, 2023', title: 'The day you said yes.',
      description: 'One little word, and suddenly the future felt different. You gave me the chance to love you, Phoebe. I never want to take that for granted.',
      // REPLACE WITH YOUR ANNIVERSARY PHOTO:
      src: './assets/hero.jpg', alt: 'A heart made with two hands', caption: 'my favorite yes' },
    { date: 'Every day since', title: 'A thousand little forevers.',
      description: 'The conversations that go nowhere and mean everything. The ordinary days made softer by you. This is the part of our story I want to keep living.',
      // REPLACE WITH A CANDID EVERYDAY PHOTO:
      src: './assets/flowers.jpg', alt: 'Soft spring blossoms', caption: 'you make ordinary beautiful' },
    { date: 'Still being written', title: 'The best is still ahead of us.',
      description: 'There are places we have not seen and versions of ourselves we have not met. Whatever comes next, I hope it has your hand in mine.',
      // REPLACE WITH A PHOTO OF A PLACE YOU WANT TO VISIT:
      src: './assets/mountains.jpg', alt: 'Mountains waiting to be explored', caption: 'so much more to come' },
  ],
  memories: [
    // ADD YOUR GALLERY PHOTOS HERE. `note` is the letter shown in the lightbox.
    // Until you replace these, the gallery is an inspiration board for your future.
    { src: './assets/hero.jpg', alt: 'Hands making a heart at sunset', title: 'You, me & the golden hour', tag: 'Little moments', note: 'A little reminder of what I want most: more sunsets with you, more time with you, more of the life we get to make together.' },
    { src: './assets/sea.jpg', alt: 'Waves beside a peaceful coastline', title: 'Somewhere, just us', tag: 'Adventures', note: 'Someday, let’s find a little stretch of coast and forget what time it is. No perfect plan. Just your laugh, the sea, and nowhere else we need to be.' },
    { src: './assets/coffee.jpg', alt: 'A cup of freshly made coffee', title: 'Slow mornings with you', tag: 'Little moments', note: 'The life I dream about has little things in it. Making your drink. Saving you the good seat. Asking about your day and staying to hear every detail.' },
    { src: './assets/flowers.jpg', alt: 'Delicate pink and white blossoms', title: 'Fun and laughters with you', tag: 'Little moments', note: 'You do not need a special occasion to be celebrated. If I could, I would leave tiny reminders of how loved you are everywhere you look.' },
    { src: './assets/mountains.jpg', alt: 'A beautiful mountain beneath an open sky', title: 'A whole world ahead', tag: 'Adventures', note: 'I want to see the world with you, but I also know this: even the most beautiful view would make me turn to see your face first.' },
    { src: './assets/sunset.jpg', alt: 'Soft golden light over a misty landscape', title: 'Until the sun goes down', tag: 'Adventures', note: 'When the world gets loud, I hope we can always be somewhere soft for each other. A deep breath. A safe place. A little bit of home.' },
  ],
  reasons: [
    'You make the most ordinary day feel like somewhere I want to stay.',
    'The way your nose crinkles when you laugh.',
    'How you know how to make me smile on a hard day.',
    'You are my favorite person to do absolutely nothing with.',
    'Your kindness, even when no one is watching.',
    'The way a message from you can change my whole mood.',
    'You make me want to become someone I can be proud of.',
    'Your laugh. I would recognize it anywhere.',
    'Even your silly stories are my favorite stories.',
    'You care about the little things that other people miss.',
    'You make the future feel less scary and more like an adventure.',
    'I never have to find a reason to miss you. I just do.',
    'Your courage on the days that are not easy.',
    'The fact that you are you, even in the smallest ways.',
    'Because my favorite hello will always be yours.',
    'You make being a little ridiculous feel perfectly right.',
    'The way you have a permanent little home in my thoughts.',
    'You remind me that love can be gentle.',
    'With you, even quiet moments feel full.',
    'You said yes to us. I am still grateful for that, every day.',
    'I like who I am when I am loving you well.',
    'Because a whole lifetime still does not sound like enough.',
  ],
  // PERSONALIZE THE QUIZ: `answer` is the correct option index, starting at 0.
  // These questions use facts you shared or sentiments in this website.
  quiz: [
    { question: 'When did our forever begin?', options: ['November 14, 2023', 'December 17, 2023', 'February 14, 2024', 'December 25, 2023'], answer: 1, praise: 'That’s our day. My favorite yes. ♡', tease: 'A tiny hint: it was December 17. I could never forget.' },
    { question: 'Who is the very best part of my day?', options: ['My morning coffee', 'My phone', 'You, obviously', 'My afternoon nap'], answer: 2, praise: 'Not even coffee stands a chance against you.', tease: 'The answer is looking at this screen right now. It’s you.' },
    { question: 'What would I choose for our next chapter?', options: ['A perfect life with no surprises', 'Whatever comes, with you', 'Unlimited Wi-Fi', 'A lifetime supply of fries'], answer: 1, praise: 'Your hand in mine. That is the whole plan.', tease: 'The fries were tempting. But I would choose life with you.' },
    { question: 'What’s my favorite kind of moment?', options: ['Only the expensive dates', 'Only the big celebrations', 'Only holidays', 'The little everyday ones with you'], answer: 3, praise: 'Every ordinary day, made beautiful by you.', tease: 'The big days are lovely. But the everyday moments with you win.' },
    { question: 'How long do I plan on choosing you?', options: ['Until the weekend', 'Until the snacks run out', 'For as long as you’ll let me', 'Exactly 365 days'], answer: 2, praise: 'And then I will ask for one more day. Always.', tease: 'The snacks will run out. My answer will still be you.' },
  ],
  bucket: [
    { id: 'lights', title: 'See the Northern Lights, hand in hand', done: false },
    { id: 'puppy', title: 'Give a golden retriever a home', done: false },
    { id: 'pasta', title: 'Make homemade pasta in Italy', done: false },
    { id: 'sunrise', title: 'Stay up long enough to watch the sunrise', done: false },
    { id: 'home', title: 'Make a little place feel like our home', done: false },
  ],
  coupons: [
    { id: 'massage', icon: 'heart', title: 'A little rest', description: 'One long back massage. You pick the playlist.' },
    { id: 'dinner', icon: 'utensils', title: 'Dinner, on me', description: 'Your favorite home-cooked meal, made with love.' },
    { id: 'movie', icon: 'film', title: 'You pick the movie', description: 'A cozy movie night. Unlimited snacks included.' },
    { id: 'day', icon: 'sun', title: 'A day that’s all yours', description: 'Your plans, your pace. My undivided attention.' },
  ],
  // MAKE THIS LETTER YOUR OWN: each string becomes a paragraph.
  letter: [
    'I have been trying to find a way to put this into words, and the truth is, words always feel a little too small for what you mean to me.',
    'Since December 17, 2023, there has been this quiet, beautiful difference in my life and that is you. Not just in the big or extravagant moments, but in the middle of a perfectly ordinary day, when something happens and you are the first person I want to tell everything, may be big or small, you are always there giving me color to my life.',
    'I know I will not always get everything right. Sometimes I cause dilemmas that will give you stress and make you mad. Sometimes, I will need to learn how to love you better every day so that I could properly repay your love. But I want to keep learning. I want to listen to you and hear every word from you and keep it in my hear. There is just something about you that make me feel comfortable and safe, show up when it matters, and make room for all the parts of you. You are always there for me.',
    'If I could give you the world, Phoebe, I would. I would even split the mountains for you or climb Mt. Everest to scream out your name. I will make sure that I will be able to get you through every beautiful place. Every chance you have been hoping for. Every soft landing after a difficult day. Give everything to you. Until I can, I will give you what is mine to give. My love, my honesty, my time, and a heart that keeps choosing you.',
    'You never have to earn your place in my heart by being perfect because you are already perfect. I love the real you. The happy you, the tired you, the you who is still figuring things out. I hope this little corner of the internet reminds you of that whenever you need it.',
    'Thank you for saying yes. Thank you for being Phoebe. Of all the stories my life could have become, I am so grateful that it became one with you in it.',
    'Here is to more ordinary days, extraordinary adventures, and a lifetime of finding our way back to each other.'
  ],
};
