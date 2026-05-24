import { useState, useEffect, useMemo, useCallback, useRef } from "react";

/* ── Fonts & Global Styles ─────────────────────────────────── */
const injectAssets = () => {
  if (!document.getElementById("av-fonts")) {
    const l = document.createElement("link");
    l.id = "av-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById("av-css")) {
    const s = document.createElement("style");
    s.id = "av-css";
    s.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      :root{--gold:#C9A84C;--gold-l:#E8C97A;--gold-d:#7a6230;--black:#080808;--s1:#111;--s2:#191919}
      html,body,#root{height:100%;background:var(--black)}
      body{color:#e8e0d0;font-family:'Jost',sans-serif;overflow-x:hidden}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0f0f0f}::-webkit-scrollbar-thumb{background:var(--gold-d);border-radius:3px}
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(201,168,76,.2)}50%{text-shadow:0 0 50px rgba(201,168,76,.6),0 0 80px rgba(201,168,76,.3)}}
      .fade-up{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both}
      .fade-up-d1{animation-delay:.1s}.fade-up-d2{animation-delay:.2s}.fade-up-d3{animation-delay:.3s}.fade-up-d4{animation-delay:.45s}
      .q-card{transition:transform .25s ease,box-shadow .25s ease;break-inside:avoid;margin-bottom:16px}
      .q-card:hover{transform:translateY(-3px)}
      .cat-card{transition:transform .3s ease,box-shadow .3s ease;cursor:pointer}
      .cat-card:hover{transform:translateY(-5px) scale(1.02)}
      .btn-gold{background:linear-gradient(135deg,#C9A84C,#E8C97A);color:#000;font-family:'Jost',sans-serif;font-weight:600;letter-spacing:.06em;border:none;cursor:pointer;transition:opacity .2s,transform .15s}
      .btn-gold:hover{opacity:.9;transform:scale(1.02)}
      .btn-outline{background:transparent;border:1px solid var(--gold-d);color:var(--gold);font-family:'Jost',sans-serif;cursor:pointer;transition:all .2s}
      .btn-outline:hover{background:rgba(201,168,76,.1);border-color:var(--gold)}
      .btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.65);font-family:'Jost',sans-serif;font-size:.78rem;cursor:pointer;transition:all .2s;border-radius:6px;padding:5px 12px}
      .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
      .nav-link{cursor:pointer;font-family:'Jost',sans-serif;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(201,168,76,.55);transition:color .2s}
      .nav-link:hover,.nav-link.active{color:var(--gold)}
      .s-input{background:rgba(255,255,255,.05);border:1px solid rgba(201,168,76,.3);border-radius:8px;color:#e8e0d0;padding:13px 20px;font-size:1rem;font-family:'Jost',sans-serif;outline:none;transition:border-color .2s,background .2s;width:100%}
      .s-input:focus{border-color:var(--gold);background:rgba(255,255,255,.07)}
      .masonry{columns:3;column-gap:16px}
      @media(max-width:900px){.masonry{columns:2}}
      @media(max-width:560px){.masonry{columns:1}}
      .modal{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:999;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}
      .modal-box{background:#141414;border:1px solid rgba(201,168,76,.22);border-radius:14px;padding:2rem;max-width:500px;width:90%;max-height:90vh;overflow-y:auto;position:relative}
      .gold-divider{height:1px;background:linear-gradient(90deg,transparent,var(--gold-d),transparent);border:none;margin:0}
      .fav-btn{background:transparent;border:none;cursor:pointer;transition:transform .2s,color .2s;line-height:1;padding:4px}
      .fav-btn:hover{transform:scale(1.25)}
      .admin-input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(201,168,76,.2);border-radius:8px;color:#e8e0d0;padding:10px 14px;font-family:'Jost',sans-serif;font-size:.9rem;outline:none;transition:border-color .2s}
      .admin-input:focus{border-color:var(--gold)}
      .pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:.7rem;font-family:'Jost',sans-serif;letter-spacing:.07em;text-transform:uppercase;font-weight:500}
      .ornament{color:var(--gold);opacity:.45;letter-spacing:.3em;font-family:'Cinzel',serif}
      .copied-toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#1a1a1a;border:1px solid var(--gold-d);border-radius:8px;padding:10px 22px;color:var(--gold);font-family:'Jost',sans-serif;font-size:.85rem;z-index:9999;animation:fadeUp .3s ease}
    `;
    document.head.appendChild(s);
  }
};
injectAssets();

/* ── Constants ────────────────────────────────────────────── */
const ADMIN_PASSWORD = "AurumVault2024";

const CATS = {
  resilience: { label:"Resilience & Strength",    icon:"⚔️",  desc:"For when you need to remember what you're made of",      color:"#8B0000", accent:"#E87070", bg:"rgba(139,0,0,.13)"   },
  self_worth: { label:"Self-Worth & Identity",     icon:"👑",  desc:"Reminders of who you truly are",                          color:"#4A1D96", accent:"#A78BFA", bg:"rgba(74,29,150,.13)"  },
  wisdom:     { label:"Wisdom & Life",             icon:"🌿",  desc:"Truths that took lifetimes to find",                      color:"#065F46", accent:"#34D399", bg:"rgba(6,95,70,.13)"    },
  love:       { label:"Love & Heartbreak",         icon:"🥀",  desc:"For every version of love you've known",                  color:"#881337", accent:"#FB7185", bg:"rgba(136,19,55,.13)"  },
  growth:     { label:"Growth & Change",           icon:"🌱",  desc:"The beautiful pain of becoming",                          color:"#14532D", accent:"#86EFAC", bg:"rgba(20,83,45,.13)"   },
  hope:       { label:"Hope & Healing",            icon:"✨",  desc:"Light for the darkest rooms",                             color:"#78350F", accent:"#FCD34D", bg:"rgba(120,53,15,.13)"  },
  pain:       { label:"Pain & Darkness",           icon:"🌑",  desc:"For when you need to feel seen",                          color:"#1E3A5F", accent:"#93C5FD", bg:"rgba(30,58,95,.13)"   },
  mindset:    { label:"Mindset & Perspective",     icon:"🧠",  desc:"How you see the world shapes it",                         color:"#2E1065", accent:"#C4B5FD", bg:"rgba(46,16,101,.13)"  },
  ambition:   { label:"Ambition & Purpose",        icon:"🔥",  desc:"Fuel for the fire in your chest",                         color:"#7C2D12", accent:"#FDBA74", bg:"rgba(124,45,18,.13)"  },
  faith:      { label:"Faith & Spirituality",      icon:"🕊️", desc:"For when you need something greater",                     color:"#3B0764", accent:"#DDD6FE", bg:"rgba(59,7,100,.13)"   },
  humanity:   { label:"Humanity & Society",        icon:"🌍",  desc:"Observations on what we are",                             color:"#134E4A", accent:"#5EEAD4", bg:"rgba(19,78,74,.13)"   },
  kindness:   { label:"Kindness & Goodness",       icon:"🤍",  desc:"The radical act of being good",                           color:"#831843", accent:"#FBCFE8", bg:"rgba(131,24,67,.13)"  },
};

/* ── All Quotes ───────────────────────────────────────────── */
const BASE_QUOTES = [
  // RESILIENCE & STRENGTH
  {t:"If they gang up against you, realise how powerful you are. Their fear is real",c:"resilience"},
  {t:"If I cannot bend the heavens, I will move hell",c:"resilience"},
  {t:"The mountains you're carrying you were only supposed to climb",c:"resilience"},
  {t:"You have already survived every bad day so far, the record speaks for itself",c:"resilience"},
  {t:"The days you don't feel like showing up are the days you need to show up the most",c:"resilience"},
  {t:"Great spirits have always encountered violent opposition from mediocre minds",c:"resilience"},
  {t:"Someday someone will break you so badly that you'll become unbreakable",c:"resilience"},
  {t:"Strength doesn't come from what you can do, it comes from overcoming what you thought you couldn't",c:"resilience"},
  {t:"Bloom where you're planted, some roots are meant to break concrete",c:"resilience"},
  {t:"Stand up even when you feel broken, the world needs warriors, not witnesses",c:"resilience"},
  {t:"Scars are just a reminder that you are stronger than whatever tried to hurt you",c:"resilience"},
  {t:"When the chances are one in a million, be that one",c:"resilience"},
  {t:"One day you will tell your story of how you overcame what you went through, and it will be someone else's survival guide",c:"resilience"},
  {t:"It always seems impossible, until it is done",c:"resilience"},
  {t:"A man is great not because he hasn't failed, but because failure hasn't stopped him",c:"resilience"},
  {t:"The moment you give up is the moment you let someone else win",c:"resilience"},
  {t:"He who has a why to live can bear almost any how",c:"resilience"},
  {t:"There is no such thing as peace in this world, that is why I'm going to create it",c:"resilience"},
  {t:"People who say it cannot be done should not interrupt those who are doing it",c:"resilience"},
  {t:"You deserve to see what happens if you don't give up",c:"resilience"},
  {t:"Some people hate you because you had less and still did more",c:"resilience"},
  {t:"Sometimes we are tested, not to show our weaknesses, but to discover our strength",c:"resilience"},
  {t:"Are you tired? That means you're doing well",c:"resilience"},
  {t:"If you were not served love on a silver spoon when you were young, you would learn how to lick it off a knife",c:"resilience"},
  {t:"It may seem difficult at first, but everything must be difficult at first",c:"resilience"},
  {t:"Everything you've ever wanted is on the other side of fear",c:"resilience"},
  {t:"You never know how strong you are until being strong is your only choice",c:"resilience"},
  {t:"Whoever is praying on my downfall, pray to a different god because this one isn't working",c:"resilience"},
  {t:"If you fake bravery when you're terrified, that is bravery",c:"resilience"},
  {t:"It's hard to wait for something that might never happen, but it's harder to give up when you know it's everything you ever wanted",c:"resilience"},
  {t:"If you give up now, then what the hell were you even fighting for?",c:"resilience"},
  {t:"It's time to remind the world who you are, and that ain't a quitter",c:"resilience"},
  {t:"Look at everything you've been through, everything you've overcome, and you're quitting now? Have some respect for yourself and the people who made you",c:"resilience"},
  {t:"Some people stop because it's hard, some people start because it's hard",c:"resilience"},
  {t:"Falling down is an accident, staying down is a choice",c:"resilience"},
  {t:"You survived too many storms to be bothered by raindrops",c:"resilience"},
  {t:"A man who came back from hell cannot be beaten",c:"resilience"},
  {t:"They wanted to see me struggle, instead they saw me rise",c:"resilience"},
  {t:"A winner is just a loser who tried one more time",c:"resilience"},
  {t:"If your path requires you to walk through hell, walk like you own hell",c:"resilience"},
  {t:"He who fights may lose, but he who doesn't has already lost",c:"resilience"},
  {t:"It won't happen overnight, but if you quit, it won't happen at all",c:"resilience"},
  {t:"Everything you thought was drowning you actually taught you how to swim",c:"resilience"},
  {t:"I may not have amazing victories, but I can amaze you with defeats I came out of alive",c:"resilience"},
  {t:"Behind every strong person, there is a story that gave them no choice",c:"resilience"},
  {t:"A man who has been destroyed a thousand times knows a thousand ways to rebuild himself",c:"resilience"},
  {t:"I survived too many storms alone, now they offer me an umbrella for rain",c:"resilience"},
  {t:"I lost everything I needed, now it's time to get everything I wanted",c:"resilience"},
  {t:"Cry behind closed doors, then walk out like you're the storm they warned about",c:"resilience"},
  {t:"Walk on your broken foot and leave no trace of your hands on anyone's shoulders",c:"resilience"},
  {t:"When a king's palace burns down, the rebuilt palace turns out even more beautiful",c:"resilience"},
  {t:"They told me I couldn't, so I did",c:"resilience"},
  {t:"The man who refuses to fight his battles ends up fighting them all in the end",c:"resilience"},
  {t:"Every accomplishment starts with the decision to try",c:"resilience"},
  {t:"You don't get what you wish for, you get what you fight for",c:"resilience"},
  {t:"When death comes to find you, may it find you alive",c:"resilience"},
  {t:"Let me fall if I must — the one I am becoming will catch me",c:"resilience"},
  {t:"If an egg is broken by outside force, life ends. If it is broken from inside force, life begins. Great things always begin from the inside",c:"resilience"},
  {t:"There may be late bloomers, but there are no flowers that don't bloom",c:"resilience"},
  {t:"Better to be a warrior in a garden than to be a gardener in a war",c:"resilience"},
  {t:"We are all a little broken, but the last time I checked, broken crayons still colour the same",c:"resilience"},
  {t:"That's the irony — broken people are not fragile",c:"resilience"},
  {t:"A bird on a tree isn't afraid of the branch breaking because its trust isn't in the branch, but in its own wings",c:"resilience"},
  {t:"Until death, all defeat is psychological",c:"resilience"},
  {t:"The strongest version of you already exists, it's just waiting for you to decide to become it",c:"resilience"},
  {t:"Rock bottom will teach you more than mountain tops ever could",c:"resilience"},
  {t:"Airplanes take off against the wind, not with it",c:"resilience"},
  {t:"You were born with wings — why choose to crawl through life?",c:"resilience"},
  {t:"Unfortunately, there will be no evidence that you tried if you don't make it",c:"resilience"},
  {t:"Winners lose more than losers ever do",c:"resilience"},
  {t:"When the road gets bumpy, you don't leave the car, you simply put your seatbelt on",c:"resilience"},

  // SELF-WORTH & IDENTITY
  {t:"To go wrong in your own way is better than to go right in someone else's",c:"self_worth"},
  {t:"Those who were seen dancing were thought to be insane by those who could not hear the music",c:"self_worth"},
  {t:"You need to stop giving 100% to people who only give 30%",c:"self_worth"},
  {t:"You search for miracles while your very existence is one",c:"self_worth"},
  {t:"You are not behind in life, you are on your own path and timeline",c:"self_worth"},
  {t:"You forgive the people who wronged you all the time, but you can't seem to forgive yourself for failing once",c:"self_worth"},
  {t:"Stop letting people who add so little to your life take so much of your peace",c:"self_worth"},
  {t:"Never design your character like a garden where anyone can walk. Design your character like the sky where everyone desires to reach",c:"self_worth"},
  {t:"Release what hurts not because you're strong, but because you finally respect yourself too much to keep carrying it",c:"self_worth"},
  {t:"Do not ask who you are, decide who you are",c:"self_worth"},
  {t:"You don't owe the world an explanation for your pace, just keep walking",c:"self_worth"},
  {t:"Every time you judge yourself, you miss an opportunity to understand yourself",c:"self_worth"},
  {t:"Never be so loyal that you betray yourself",c:"self_worth"},
  {t:"How silly of me to apologise for caring when it was the only thing that made me rare",c:"self_worth"},
  {t:"Being able to endure something does not equal an obligation to withstand it",c:"self_worth"},
  {t:"Your value doesn't decrease based on someone's inability to see your worth",c:"self_worth"},
  {t:"It's only when you don't know yourself that other people's opinions become important",c:"self_worth"},
  {t:"Love yourself instead of loving the idea of other people loving you",c:"self_worth"},
  {t:"Are you who you want to be?",c:"self_worth"},
  {t:"Imagine thinking you weren't good enough, when the whole time you were too good",c:"self_worth"},
  {t:"If the path before you is clear, you're probably on someone else's",c:"self_worth"},
  {t:"You might be the sweetest peach on the tree, but some people just don't like peaches",c:"self_worth"},
  {t:"Be weird, be random, be who you are, because you never know who would love the person you're hiding",c:"self_worth"},
  {t:"You were born as an original, don't die as a copy",c:"self_worth"},
  {t:"One who believes in himself has no need to convince others",c:"self_worth"},
  {t:"If I won't be myself, who will?",c:"self_worth"},
  {t:"May you never shrink yourself to fit places you've outgrown",c:"self_worth"},
  {t:"The biggest prison we live in is the fear of what others will think",c:"self_worth"},
  {t:"Wanting to be someone else is a waste of who you are",c:"self_worth"},
  {t:"You'll never find another me, and that's enough revenge",c:"self_worth"},
  {t:"Life is not about finding yourself, life is about creating yourself",c:"self_worth"},
  {t:"Don't put out your fire just because someone else doesn't understand your flame",c:"self_worth"},
  {t:"Be yourself so the people looking for you can find you",c:"self_worth"},
  {t:"Humble enough to know I'm replaceable, confident enough to know there's no one like me",c:"self_worth"},
  {t:"Human worth was never meant to be earned, it simply is",c:"self_worth"},
  {t:"Your boos don't mean anything to me, I've seen what you people cheer for",c:"self_worth"},
  {t:"If I asked you to name everything you love, how long would it take for you to name yourself?",c:"self_worth"},
  {t:"If you're always adapting, at what point is it called being yourself?",c:"self_worth"},
  {t:"I would rather be hated for who I am than loved for who I am not",c:"self_worth"},
  {t:"People know your worth, they just hope you don't",c:"self_worth"},
  {t:"Stop apologising for expressing your feelings — you're convincing yourself that you're not worth the space you take up",c:"self_worth"},
  {t:"I will not think less of myself just because you do not know how to love me",c:"self_worth"},
  {t:"Just because I don't require much doesn't mean I deserve the bare minimum",c:"self_worth"},
  {t:"You were never asking for too much, you were just asking the wrong person",c:"self_worth"},
  {t:"The version of you that some created in their mind is not your responsibility to maintain",c:"self_worth"},
  {t:"What if who I hoped to be was always me?",c:"self_worth"},
  {t:"I am a museum full of art, but you had your eyes shut",c:"self_worth"},
  {t:"Respect yourself before expecting respect from others",c:"self_worth"},
  {t:"Be yourself, everyone else is taken",c:"self_worth"},
  {t:"My presence is witnessed by many, but my words are gifted to few",c:"self_worth"},
  {t:"While you're overthinking and doubting yourself, someone else is looking at you wondering how you do it all",c:"self_worth"},
  {t:"Don't ever say you're not good enough. If others can't see how amazing you are, then they're the ones who aren't good enough for you",c:"self_worth"},
  {t:"How beautiful you are, that the creator of this universe decided it needed one of you",c:"self_worth"},
  {t:"You break yourself for others so you'll feel valuable, because deep down you don't believe you are",c:"self_worth"},
  {t:"Can you remember who you were before the world told you who you should be?",c:"self_worth"},
  {t:"Let others disqualify you, but never disqualify yourself. Never be the one who says no to yourself",c:"self_worth"},
  {t:"I'm not here to settle, I'm here to soar",c:"self_worth"},
  {t:"A crown doesn't grant power, it reveals it",c:"self_worth"},
  {t:"What are you? To define is to limit",c:"self_worth"},
  {t:"She never looked nice — she looked like art. And art wasn't supposed to look nice, it was supposed to make you feel something",c:"self_worth"},
  {t:"Some people are artists; some, themselves, are art",c:"self_worth"},
  {t:"I was ashamed of myself when I realised that life was a costume party, and I attended with my real face",c:"self_worth"},
  {t:"Better appreciate my kindness — even I am afraid of my dark side",c:"self_worth"},
  {t:"Sometimes you need to forget how you feel and remember what you deserve",c:"self_worth"},
  {t:"The seats are empty, the theatre is dark — why do you keep acting?",c:"self_worth"},
  {t:"You are free, and that is why you are lost",c:"self_worth"},
  {t:"One day you will realise that no one was really watching and you could have done whatever you wanted",c:"self_worth"},
  {t:"Admire someone's beauty without questioning your own",c:"self_worth"},
  {t:"If everything you offered wasn't enough, offer your absence. Salt isn't on the menu, but when it's missing, you feel it",c:"self_worth"},
  {t:"If you are an ocean, be an ocean. Don't be a pond just because people can't swim",c:"self_worth"},
  {t:"I like being alone — I have control over my own life. Therefore, in order to win me over, your presence has to feel better than my solitude. You are not competing with another person, you are competing with my comfort zones",c:"self_worth"},
  {t:"To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment",c:"self_worth"},

  // WISDOM & LIFE
  {t:"A man who fears suffering is already suffering from what he fears",c:"wisdom"},
  {t:"The difference between stupidity and genius is that genius has its limits",c:"wisdom"},
  {t:"The best way to defeat your enemy is to make him your friend",c:"wisdom"},
  {t:"A wise man never knows all, only fools know everything",c:"wisdom"},
  {t:"The mouth should have three gatekeepers: is it true? Is it kind? Is it necessary?",c:"wisdom"},
  {t:"No matter what anybody tells you, words and ideas can change the world",c:"wisdom"},
  {t:"We all face death in the end. But on the way, be careful to never hurt a human heart",c:"wisdom"},
  {t:"I learned that every mortal will taste death, but only few will taste life",c:"wisdom"},
  {t:"The dead receive more flowers than the living because regret is stronger than gratitude",c:"wisdom"},
  {t:"Sunshine all the time creates a desert",c:"wisdom"},
  {t:"A person born in a garden would never know the value of flowers",c:"wisdom"},
  {t:"You either face your demons, or they raise your children",c:"wisdom"},
  {t:"The most dangerous people are not those who show their darkness, but those who hide it behind light",c:"wisdom"},
  {t:"Sometimes trying to prove you are the best is an insult",c:"wisdom"},
  {t:"Never take the peace from someone who was raised in war",c:"wisdom"},
  {t:"Life teaches us the use of time, and time teaches us the value of life",c:"wisdom"},
  {t:"When the character of a man is not clear to you, look at his friends",c:"wisdom"},
  {t:"Even pleasures become punishments when taken beyond a certain point",c:"wisdom"},
  {t:"You cannot wish for a strong character and an easy life, the price of each is the other",c:"wisdom"},
  {t:"If hard work leads to success, the donkey would own the farm",c:"wisdom"},
  {t:"Do not raise your children the way your parents raised you, they were born for a different time",c:"wisdom"},
  {t:"Why should I fear death? If I am, death is not. If death is, I am not. Why should I fear a thing that can only exist when I am not?",c:"wisdom"},
  {t:"Don't listen to every elder's advice — even fools grow older",c:"wisdom"},
  {t:"Judge a man by the reputation of his enemies",c:"wisdom"},
  {t:"In the war of ego, the loser always wins",c:"wisdom"},
  {t:"The true journey begins the moment you stop looking for the destination",c:"wisdom"},
  {t:"When an actor is bad, applause only makes him worse",c:"wisdom"},
  {t:"Anyone who keeps the ability to see beauty never grows old",c:"wisdom"},
  {t:"It is dangerous to be right in matters where established men are wrong",c:"wisdom"},
  {t:"Time is the only currency you spend without ever knowing your balance — spend it wisely",c:"wisdom"},
  {t:"A mistake that makes you humble is better than an achievement that makes you arrogant",c:"wisdom"},
  {t:"Let the young man in his desperation go out and hunt. If he kills the elephant, his poverty ends. If the elephant kills him, his poverty ends",c:"wisdom"},
  {t:"Who am I to judge another when my own soul is not without scars?",c:"wisdom"},
  {t:"It's better to be a restrained monster than a well-behaved coward",c:"wisdom"},
  {t:"When it's your turn to be the hammer, hit hard — because when you were the nail, no one had mercy on you",c:"wisdom"},
  {t:"Arguments only separate those who already wanted to leave",c:"wisdom"},
  {t:"Wrong does not cease to be wrong because the majority share in it",c:"wisdom"},
  {t:"It is better to be in chains with friends than in a garden with strangers",c:"wisdom"},
  {t:"The devil cannot make hell look beautiful, so he makes beautiful roads that lead there",c:"wisdom"},
  {t:"Don't tell me what they said about me, tell me why they were so comfortable saying it around you",c:"wisdom"},
  {t:"Consider how hard it is to change yourself, and you'll understand how foolish it is to think you can change someone else",c:"wisdom"},
  {t:"There is nothing more unequal than the equal treatment of unequal people",c:"wisdom"},
  {t:"A title might make you a boss, but your people decide if you're a leader",c:"wisdom"},
  {t:"The ironic tragedy is that life can only be lived forward, but only makes sense in reverse",c:"wisdom"},
  {t:"It requires wisdom to understand wisdom. The music is nothing if the audience is deaf",c:"wisdom"},
  {t:"Peace doesn't come to men who refuse to declare war on what's destroying them",c:"wisdom"},
  {t:"A child's first enemy is an unhealed parent",c:"wisdom"},
  {t:"The scariest part about manipulation is realising how long you made excuses for it. A golden cage still holds a prisoner",c:"wisdom"},
  {t:"We don't see the world as it is, we see the world as we are",c:"wisdom"},
  {t:"There are people in this world who prefer solitude, but there is no one who can withstand it",c:"wisdom"},
  {t:"Nothing can be gained without losing — even heaven demands death",c:"wisdom"},
  {t:"It's not that we have a short time to live, but that we waste a lot of it",c:"wisdom"},
  {t:"Slow success builds character, fast success builds ego",c:"wisdom"},
  {t:"If you don't stand for something, you will fall for anything",c:"wisdom"},
  {t:"A satisfied life is better than a successful life, because our success is measured by others, but our satisfaction is measured by ourselves",c:"wisdom"},
  {t:"Thinking is difficult, that is why most people judge",c:"wisdom"},
  {t:"You can't add days to your life, but you can add life to your days",c:"wisdom"},
  {t:"Can success exist without happiness, or is happiness the true success?",c:"wisdom"},
  {t:"Biting your tongue while eating is the perfect example of how you can mess up even with years of experience",c:"wisdom"},
  {t:"The past is a place to learn from, not live in",c:"wisdom"},
  {t:"The cold water does not get warmer if you jump late",c:"wisdom"},
  {t:"He who fears death will never do anything worthy of a man who is alive",c:"wisdom"},
  {t:"We judge others by their actions, but we judge ourselves by our intentions",c:"wisdom"},
  {t:"A child who does not receive warmth from the village will burn it down to feel it",c:"wisdom"},
  {t:"There are only two important days in your life: the day you were born, and the day you find out why",c:"wisdom"},
  {t:"You cannot make someone love you by giving them more of what they don't already appreciate",c:"wisdom"},
  {t:"You only live once, but if you do it right, once is enough",c:"wisdom"},
  {t:"Lust is the craving for salt of a man who is dying of thirst",c:"wisdom"},
  {t:"A sinner seeks forgiveness not when they regret the sin, but when the sin no longer excites them",c:"wisdom"},
  {t:"The fear lasts seconds, the shame lasts days, but the regret lasts forever",c:"wisdom"},
  {t:"In chess, white and black are enemies, but those who move the pieces are usually good friends",c:"wisdom"},
  {t:"The most dangerous form of blindness is believing that your perspective is the only reality",c:"wisdom"},
  {t:"He who was bitten by a snake fears even a rope",c:"wisdom"},
  {t:"Everyone's story makes sense when you hear the chapters you never knew about",c:"wisdom"},
  {t:"You can never gain cold — it is the absence of heat. Maybe hatred is just the absence of love?",c:"wisdom"},
  {t:"Don't blame a clown for being a clown, ask yourself why you keep going to the circus",c:"wisdom"},
  {t:"It is everyone's first time living, so how can you be good right from the start?",c:"wisdom"},
  {t:"Climb mountains not so people can see you, but so you can see the world",c:"wisdom"},
  {t:"You can have a thousand problems in life, until you have a health problem — then you only have one",c:"wisdom"},
  {t:"Light is faster than sound, that is why some people appear bright until you hear them speak",c:"wisdom"},
  {t:"Home only has meaning to those who have had one",c:"wisdom"},
  {t:"Breathing looks a lot like living if you're not paying attention",c:"wisdom"},
  {t:"When death greets you, all you have is who you have become",c:"wisdom"},
  {t:"The nail spent its whole life listening to the praises of the painting it carried the weight of",c:"wisdom"},
  {t:"Beware of what you become in pursuit of what you want",c:"wisdom"},
  {t:"Therapy only works when we have a genuine desire to know ourselves as we are, not as we would like to be",c:"wisdom"},
  {t:"People give what they need. Ultimately, you become whoever would have saved you at the time no one did",c:"wisdom"},
  {t:"Wise men talk because they have something to say; fools, because they have to say something",c:"wisdom"},
  {t:"The only true wisdom is in knowing you know nothing",c:"wisdom"},
  {t:"The man who asks a question is a fool for a minute, the man who does not ask is a fool for life",c:"wisdom"},
  {t:"Everything you say should be true, but not everything true should be said",c:"wisdom"},
  {t:"Two things ruin wisdom: staying silent when you should speak, and speaking when you should be silent",c:"wisdom"},
  {t:"It is the mark of an educated mind to be able to entertain a thought without accepting it",c:"wisdom"},
  {t:"A wise man can learn more from a foolish question than a fool can from a wise answer",c:"wisdom"},
  {t:"Do not speak unless your words are more beautiful than silence",c:"wisdom"},
  {t:"The price of anything is the amount of life you exchange for it",c:"wisdom"},
  {t:"Tomorrow is a hope, not a promise",c:"wisdom"},
  {t:"Promises are made in moments of passion, loyalty is tested in storms of reality",c:"wisdom"},
  {t:"Search for everything you want, except love and death — those two will find you when the time comes",c:"wisdom"},
  {t:"I am not what you think I am — you are what you think I am",c:"wisdom"},
  {t:"The one who doesn't remember the past is condemned to repeat it; the one who remembers is condemned to watch others repeat it",c:"wisdom"},
  {t:"I complained I had no shoes until I met a man who had no feet",c:"wisdom"},
  {t:"Trust in God, but tie your camel",c:"wisdom"},
  {t:"Cold water feels warm when your hands are cold",c:"wisdom"},
  {t:"Two things define you: your patience when you have nothing, and your attitude when you have everything",c:"wisdom"},
  {t:"Having stuff isn't fun, getting stuff is fun",c:"wisdom"},
  {t:"It's not the pursuit of happiness, it's the happiness of pursuit",c:"wisdom"},
  {t:"Whatever happens to you has been waiting to happen since the beginning of time",c:"wisdom"},
  {t:"Whatever begins in anger, ends in shame",c:"wisdom"},
  {t:"No man knows how bad he is until he has tried very hard to be good",c:"wisdom"},
  {t:"If you always do what you always did, you'll always get what you always got",c:"wisdom"},
  {t:"He who cannot obey himself will be commanded — that is the nature of living creatures",c:"wisdom"},
  {t:"If you crush a cockroach, you're a hero. If you crush a butterfly, you're a villain. Morals have aesthetic criteria",c:"wisdom"},
  {t:"We accept the love we think we deserve",c:"wisdom"},
  {t:"One of the saddest things in the world is an old man in his twenties",c:"wisdom"},
  {t:"The greatest way to live with honour in this world is to be what we pretend to be",c:"wisdom"},
  {t:"When setting out on a journey, do not seek advice from those who have never left home",c:"wisdom"},
  {t:"To steal ideas from one person is plagiarism; to steal from many is research",c:"wisdom"},
  {t:"When my father didn't have my hand, he had my back",c:"wisdom"},
  {t:"An optimist believes we live in the best possible world; a pessimist fears that it is true",c:"wisdom"},
  {t:"A ship is safe in a harbour, but that is not what ships are for",c:"wisdom"},
  {t:"If you think having uncomfortable conversations is hard, wait until you see the results of not having them",c:"wisdom"},
  {t:"Rather fail with honour than succeed by fraud",c:"wisdom"},
  {t:"Draw a monster. Why is it a monster?",c:"wisdom"},
  {t:"The fool who trusts everyone is the first to become wise",c:"wisdom"},
  {t:"If you don't think a penny is worthy of being picked up, you are not worth a penny",c:"wisdom"},
  {t:"The black sheep is sometimes the only one telling the truth",c:"wisdom"},
  {t:"If at your age someone is living off their father's money while you are working hard, you are not competing with them — you're competing with their father",c:"wisdom"},
  {t:"You will face men who love death as much as you love life",c:"wisdom"},
  {t:"Embarrassment is an under-explored emotion — go out there and make a fool of yourself",c:"wisdom"},
  {t:"He who shits on the road will meet flies on his return",c:"wisdom"},
  {t:"None of us sit high enough to look down on anybody",c:"wisdom"},
  {t:"If your phone doesn't ring when you are struggling, remember not to pick up calls when you are winning",c:"wisdom"},
  {t:"People have beautiful things to say about you, but you must die first",c:"wisdom"},
  {t:"If a poem hasn't ripped apart your soul, you haven't experienced poetry",c:"wisdom"},
  {t:"Envy no man, for whatever you see, a price was paid",c:"wisdom"},
  {t:"Women, money, and power have one thing in common — they run away from a desperate man",c:"wisdom"},
  {t:"A man is a slave to anything he can't walk away from",c:"wisdom"},
  {t:"Sometimes you have to suffer in life, not because you were bad, but because you didn't realise when to stop being good",c:"wisdom"},

  // LOVE & HEARTBREAK
  {t:"Love remains a word until someone comes and gives it meaning",c:"love"},
  {t:"The whole world could be in front of me, yet my eyes would only search for yours",c:"love"},
  {t:"The cruelest part of life is knowing who you love but not knowing who loves you",c:"love"},
  {t:"Love is not about finding someone to live with, but finding someone you cannot live without",c:"love"},
  {t:"We look for someone to grow old with, when the secret is to find someone to stay a child with",c:"love"},
  {t:"How dare I want love when all I know is lust",c:"love"},
  {t:"The love that I thought would save me from all the world's tortures, tortured me more than the world did",c:"love"},
  {t:"Sometimes it isn't the one who takes your breath away, it's the one who reminds you to breathe",c:"love"},
  {t:"Are you in love with a person, or an idea?",c:"love"},
  {t:"May you find someone who speaks your language so you don't have to spend a lifetime translating your soul",c:"love"},
  {t:"Everyone is trying to find the right person, but no one is trying to be the right person",c:"love"},
  {t:"If you want a woman to be an angel in your life, create a paradise for her. Angels don't live in hell",c:"love"},
  {t:"If it stays, it is love. If it ends, it's a love story. If it never begins, it's poetry",c:"love"},
  {t:"I avoid attachment because I fear abandonment",c:"love"},
  {t:"Love seems to be more cruel to the kind ones",c:"love"},
  {t:"Years of love have been forgotten in the hatred of a minute",c:"love"},
  {t:"The price of loving someone very much is never loving anyone again",c:"love"},
  {t:"If death is the eternal sleep, then I wish to die, for I dream of you eternally",c:"love"},
  {t:"Sometimes you can't let go of what's making you sad because it was the only thing that made you happy",c:"love"},
  {t:"Nothing vanishes the light in a man's eyes like the abandonment of a woman who was his land, sky, and universe",c:"love"},
  {t:"I can say with great certainty and absolute honesty that I did not know what love was until I knew what love was not",c:"love"},
  {t:"I hope loving me isn't the hardest thing anyone has to do",c:"love"},
  {t:"Love is the most twisted curse of all",c:"love"},
  {t:"If love is just a word, why does it hurt so much when you realise it isn't there?",c:"love"},
  {t:"Once you fall in love with a pair of eyes, you're blinded to all other pairs",c:"love"},
  {t:"I never knew how to love someone right. The only difference is that while they gave up, I never wanted to stop trying to learn how",c:"love"},
  {t:"Happiness is a choice, that's why I chose you",c:"love"},
  {t:"You love me for the way I'd never leave, and I love you for the thousand secret ways you make me stay",c:"love"},
  {t:"I find the most beautiful moments in life aren't just with you, but because of you",c:"love"},
  {t:"Your task is not to seek love, but merely to find all the barriers within yourself that you have built against it",c:"love"},
  {t:"Trust the overthinker who says they love you — they've thought of every reason not to, and still do",c:"love"},
  {t:"Once a man learns to feel love, he must also bear the risk of feeling hate",c:"love"},
  {t:"There can be no love where respect is gone",c:"love"},
  {t:"Love is unconditional, trust and respect are not",c:"love"},
  {t:"If love could have saved you, you would have lived forever",c:"love"},
  {t:"Show me your thorns and I'll show you hands ready to bleed",c:"love"},
  {t:"Somewhere, someone is searching for you in every person they meet",c:"love"},
  {t:"You put up walls so high that only the crazy would climb them to be with you — well, here I am",c:"love"},
  {t:"Don't cry because it's over, smile because it happened",c:"love"},
  {t:"Show me all the parts of you that you do not love, so I know where to begin",c:"love"},
  {t:"I could have been someone who lived",c:"love"},
  {t:"We get together with people because they're the same or because they're different, and in the end we split with them for exactly the same reasons",c:"love"},
  {t:"Some people are going to leave, but that's not the end of your story — that's the end of their part in your story",c:"love"},
  {t:"Move on like you never knew them, because in reality you didn't",c:"love"},
  {t:"It's hard to trust when all you have from the past is evidence why you shouldn't",c:"love"},
  {t:"You did not mean to be cruel, but that doesn't mean you were kind",c:"love"},
  {t:"I dropped my standards to lift yours",c:"love"},

  // GROWTH & CHANGE
  {t:"Sometimes who you become while chasing your goal is better than actually hitting your goal",c:"growth"},
  {t:"Any lesson you refuse to learn will repeat itself until you change",c:"growth"},
  {t:"When we are no longer able to change a situation, we are challenged to change ourselves",c:"growth"},
  {t:"The butterfly you chased was meant to show you the beauty of letting go",c:"growth"},
  {t:"Once you learn to step out of your comfort zone, every place becomes comfortable",c:"growth"},
  {t:"When you start to improve yourself, loneliness is the price you pay",c:"growth"},
  {t:"Don't be afraid to start over again. This time you're not starting from scratch, you're starting from experience",c:"growth"},
  {t:"When your friends start to say you've changed, it's because they don't know how to say you've grown",c:"growth"},
  {t:"You don't notice your progress in life because you are always raising the bar",c:"growth"},
  {t:"You tried something, it wasn't right. At least now you know it won't exist as a what-if",c:"growth"},
  {t:"Better to admit you walked through the wrong door than to live your whole life in the wrong room",c:"growth"},
  {t:"If you don't heal from your childhood trauma, your partner becomes your parent",c:"growth"},
  {t:"You can't heal if you keep pretending you're not hurt",c:"growth"},
  {t:"If you focus on the hurt, you will continue to suffer. If you focus on the lesson, you will continue to grow",c:"growth"},
  {t:"I realised that I'm searching for what I really want in life. And I have absolutely no idea what that is, and that's okay",c:"growth"},
  {t:"Failure is the information you need to get where you're going",c:"growth"},
  {t:"Your life does not get better by chance, it gets better by change",c:"growth"},
  {t:"By changing nothing, nothing changes",c:"growth"},
  {t:"Sometimes deciding who you are is deciding who you'll never be again",c:"growth"},
  {t:"Perhaps healing isn't about becoming who you were before the wound, but meeting who you became while surviving it",c:"growth"},
  {t:"When you think about giving up, think about how far you've come",c:"growth"},
  {t:"You'll never fix your future if you keep negotiating with your past",c:"growth"},
  {t:"Day by day nothing changes, but when you look back, everything is different",c:"growth"},
  {t:"Don't be scared to start over — you might like your new story better",c:"growth"},
  {t:"To become who you are meant to be, you must sacrifice who you are",c:"growth"},
  {t:"Perhaps losing what you thought you wanted helped you find what you truly needed",c:"growth"},
  {t:"I may not be the man I want to be, but I'm trying to avoid the man I used to be",c:"growth"},
  {t:"They said you changed — you're supposed to",c:"growth"},
  {t:"Choosing comfort over discomfort doesn't lead to a truly comfortable life",c:"growth"},
  {t:"We cannot solve our problems with the same thinking we used when we created them",c:"growth"},
  {t:"Before you heal someone, ask them if they're willing to give up the things that made them sick",c:"growth"},
  {t:"Some years are for growing, but this one is for blooming",c:"growth"},
  {t:"When a flower doesn't bloom, you fix the environment in which it grows, not the flower",c:"growth"},
  {t:"Forgive others not because they deserve forgiveness, but because you deserve peace",c:"growth"},
  {t:"The man whom pain has not taught will always remain a child",c:"growth"},
  {t:"No tree can grow to heaven unless its roots reach down to hell",c:"growth"},
  {t:"Someday you'll wish you could go back in time, not to change anything, but just to feel the way it used to be",c:"growth"},
  {t:"Consistency looks like nothing is happening, until everything changes",c:"growth"},
  {t:"Forgive yourself for not knowing what only time could teach you",c:"growth"},

  // HOPE & HEALING
  {t:"Never deprive someone of hope, it might be all that they have",c:"hope"},
  {t:"Live your life to the fullest not because it's always easy, but because you deserve to see how beautiful it can still become",c:"hope"},
  {t:"If everything around you seems dark, look again — you may be the light",c:"hope"},
  {t:"I figure that if I live long enough, something good might happen",c:"hope"},
  {t:"If it once made you happy, it was never a waste of time",c:"hope"},
  {t:"Everything will be okay in the end, and if it's not okay, it's not the end",c:"hope"},
  {t:"Some of the best times of your life haven't even happened yet",c:"hope"},
  {t:"There is a past version of yourself that is proud of how far you have come",c:"hope"},
  {t:"You're not lost, you're here",c:"hope"},
  {t:"May you look back and see not just where you came from, but how high you've risen",c:"hope"},
  {t:"Maybe, just maybe, your 'someday' is almost here",c:"hope"},
  {t:"Maybe true happiness is when we are happy with ourselves",c:"hope"},
  {t:"Don't let the bad days make you believe you have a bad life",c:"hope"},
  {t:"Someone out there feels better because you exist",c:"hope"},
  {t:"You've been through too much to let anyone take away your happiness",c:"hope"},
  {t:"There may be more beautiful times, but this one is ours",c:"hope"},
  {t:"Sometimes I ask 'What is the point of all this?' and then I hang out with the people I love, and for a brief moment, I see",c:"hope"},
  {t:"We don't even ask for happiness, just a little less pain",c:"hope"},
  {t:"Maybe the boredom you feel now is the peace you were asking for",c:"hope"},
  {t:"Don't forget how badly you once wanted what you have now",c:"hope"},
  {t:"You are currently living at least one of the prayers you used to pray",c:"hope"},
  {t:"There is some good in this world, and it's worth fighting for",c:"hope"},
  {t:"There's a seat waiting for you at tables you haven't even seen yet",c:"hope"},
  {t:"One day you'll just be a memory to some people — do your best to be a good one",c:"hope"},
  {t:"There is a future version of you absolutely begging you to enjoy where you are right now",c:"hope"},
  {t:"There will always be a reason you meet people — either you need them to change your life, or you're the one who helps change theirs",c:"hope"},
  {t:"The weight you're carrying might be the strength you're building",c:"hope"},
  {t:"Maybe you don't exist in the future you're so worried about",c:"hope"},
  {t:"If it brings you peace, it doesn't need to make sense to anyone else",c:"hope"},
  {t:"It's okay to be sad after making the right decision",c:"hope"},
  {t:"Happiness is the byproduct of becoming the best version of yourself",c:"hope"},
  {t:"And I believe in the good nature of people, despite everything I experienced",c:"hope"},
  {t:"When God wanted to explain what beauty meant, he created you",c:"hope"},
  {t:"When God created you, he looked at the sunset and thought to himself: this, but in human form",c:"hope"},
  {t:"If it makes you happy, it doesn't have to make sense to anyone else",c:"hope"},
  {t:"Being happy doesn't mean you have it all, it simply means you're thankful for all you have",c:"hope"},
  {t:"True happiness is all about smiling and making others smile",c:"hope"},
  {t:"Peace is not found in perfection, but in the acceptance of imperfection",c:"hope"},
  {t:"I do what I can for people because I wish I had somebody like me in my life",c:"hope"},
  {t:"The reason you want it so badly is that the version of you in the future already has it",c:"hope"},

  // PAIN & DARKNESS
  {t:"Loneliness isn't the absence of people, it is the absence of being understood",c:"pain"},
  {t:"My crime was feeling everything too deeply, my punishment was surviving it",c:"pain"},
  {t:"I was burning while you came blaming me for the smell of ashes",c:"pain"},
  {t:"If a man dies with no wounds on his body, but a war inside his head — did he really die by his own hand, or was he murdered by everything he couldn't say?",c:"pain"},
  {t:"I got called lazy by people who didn't even know I was trying to keep myself alive",c:"pain"},
  {t:"I'm scared this is all I will ever be",c:"pain"},
  {t:"What if in trying to be everything, I end up being nothing?",c:"pain"},
  {t:"I know he had it worse when he was little, but I was little too",c:"pain"},
  {t:"If you lose your reason to live, you're already in hell",c:"pain"},
  {t:"People settle for a level of despair they can tolerate and call it happiness",c:"pain"},
  {t:"When all you have known is chaos, peace can feel like a threat",c:"pain"},
  {t:"An ocean of people, but I can't find even a drop of humanity",c:"pain"},
  {t:"Some of us never found time to be happy because we were too busy trying to be strong",c:"pain"},
  {t:"Perhaps when we find ourselves wanting everything, it is because we are dangerously close to wanting nothing",c:"pain"},
  {t:"I've lived too long with pain — I won't know who I am without it",c:"pain"},
  {t:"Was I raised without love, or was I born unlovable?",c:"pain"},
  {t:"I want to be happy but something inside me screams that I do not deserve it",c:"pain"},
  {t:"I didn't need to be stronger, I needed to be safe",c:"pain"},
  {t:"I hope my last breath is a sigh of relief",c:"pain"},
  {t:"How do we forgive ourselves for all the things we did not become?",c:"pain"},
  {t:"You don't need water to feel like you're drowning",c:"pain"},
  {t:"Nothing feels heavier than unsaid words",c:"pain"},
  {t:"I tell myself I don't need anybody, but the truth is nobody needs me",c:"pain"},
  {t:"Every day I wait for something I can't name, and all that happens is the end of another day",c:"pain"},
  {t:"If only my heart were as cold as I pretend it is, maybe I could get over this",c:"pain"},
  {t:"If no one knows you're alive, you aren't",c:"pain"},
  {t:"It is sad that some people aren't waiting for their happy ending anymore, they're just waiting for their end",c:"pain"},
  {t:"Depression is being colourblind and constantly told how colourful the world is",c:"pain"},
  {t:"The storms in my head ruin the garden that my soul holds",c:"pain"},
  {t:"I think you are having a different sort of heartbreak — maybe a kind of heartbreak of being in a world when you don't know how to be",c:"pain"},
  {t:"I feel like I'm trying to find peace in a world that's constantly at war with itself",c:"pain"},
  {t:"Finding my way through a storm I don't know how to talk about",c:"pain"},
  {t:"It hurt because no one ever looked at me as if there was something in me worth fighting for",c:"pain"},
  {t:"Cursed are those who feel oceans but can express only a drop of it",c:"pain"},
  {t:"I miss the way I viewed the world before I knew too much",c:"pain"},
  {t:"I think too deeply about everything. I still don't know if that allows me to see more of the world, or less of it",c:"pain"},
  {t:"How many times have you died to be so strong? How many times have you screamed to be so silent?",c:"pain"},
  {t:"Look at you, comforting others with the words you wish to hear",c:"pain"},
  {t:"Damaged people are dangerous — they know how to make hell feel like home",c:"pain"},
  {t:"I begin to speak only when I'm certain what I'll say isn't better left unsaid",c:"pain"},
  {t:"The people who wound us get no say in how we clean up the blood",c:"pain"},
  {t:"When nobody wakes you up in the morning, when nobody waits for you at night, and when you can do whatever you want — what do you call it? Freedom or loneliness?",c:"pain"},
  {t:"To whom do I owe the biggest apology? No one has been crueller to me than I have been to me",c:"pain"},
  {t:"The greatest loss in life is not death, but what dies inside us while we're still alive",c:"pain"},
  {t:"So many broken children living in grown bodies mimicking adult lives",c:"pain"},

  // MINDSET & PERSPECTIVE
  {t:"Maybe your garden isn't growing because every time a flower grows, you cut it to prove to someone that you're a gardener",c:"mindset"},
  {t:"If you want to make yourself feel better, blame other people. If you want to make yourself get better, blame yourself",c:"mindset"},
  {t:"We've all got both light and dark inside of us — what matters is the part we choose to act on",c:"mindset"},
  {t:"Sometimes you already have everything that you need, you are just focused on the wrong thing",c:"mindset"},
  {t:"You can't get so hung up on where you'd rather be that you forget to make the most of where you are",c:"mindset"},
  {t:"You can't have a new reality with an old mentality",c:"mindset"},
  {t:"Don't let the pursuit of tomorrow distract you from the beauty of today",c:"mindset"},
  {t:"Your mind is a garden — what you plant will grow",c:"mindset"},
  {t:"Happiness is not found in the future, it is created in the present",c:"mindset"},
  {t:"The story you keep telling yourself is the one that shapes your reality",c:"mindset"},
  {t:"Of all the liars in the world, sometimes the worst are our own fears",c:"mindset"},
  {t:"We romanticise the stars but forget the dark is what made them visible",c:"mindset"},
  {t:"If you are constantly in a storm, don't check the weather — check your decisions",c:"mindset"},
  {t:"Controlling your anger makes you realise how pointless most arguments are",c:"mindset"},
  {t:"The fears we don't face become our limits",c:"mindset"},
  {t:"If you look for the light, you will often find it. But if you look for the dark, it is all you will ever see",c:"mindset"},
  {t:"The past is in your head, the future is in your hands",c:"mindset"},
  {t:"Haters don't hate you, they hate themselves because you are a reflection of what they want to be",c:"mindset"},
  {t:"If it's out of your hands, it deserves freedom from your mind too",c:"mindset"},
  {t:"Life is coming from you, not at you",c:"mindset"},
  {t:"People bring up your past when they are intimidated by your future",c:"mindset"},
  {t:"When you reach the peak, you realise the mountain wasn't the obstacle, you were",c:"mindset"},
  {t:"We always work for a better tomorrow, but instead of enjoying it when it comes, we chase another",c:"mindset"},
  {t:"When you're born in a burning home, you think the world is on fire, but it's not",c:"mindset"},
  {t:"You don't suffer because of the thing you suffer, but because of how you see the thing",c:"mindset"},
  {t:"Decisions, not conditions, determine what a man is",c:"mindset"},
  {t:"Whatever you're not changing, you're choosing",c:"mindset"},
  {t:"You can't calm the storm. What you can do is calm yourself — the storm will pass",c:"mindset"},
  {t:"Worrying does not take away tomorrow's troubles, it takes away today's peace",c:"mindset"},
  {t:"Worrying doesn't take away tomorrow's trouble, it just takes away today's happiness",c:"mindset"},
  {t:"Do not disturb yourself by imagining your whole life at once",c:"mindset"},
  {t:"Fear is a liar — it tells you that you have something to lose",c:"mindset"},
  {t:"Your body can handle almost everything — it's your mind you have to convince",c:"mindset"},
  {t:"A certain darkness is needed to see the stars",c:"mindset"},
  {t:"Life is 100% fair. You always get what you deserve, you just can't stand seeing the true results of your efforts",c:"mindset"},
  {t:"If you spoke to your friends the way you speak to yourself, would they hang around?",c:"mindset"},
  {t:"Never confuse people who are always around you with people who are always there for you",c:"mindset"},
  {t:"Are we what we do with time, or what time does with us?",c:"mindset"},
  {t:"The problem is you're trying to hold on and let go at the same time",c:"mindset"},
  {t:"You can't wake someone who is pretending to sleep",c:"mindset"},
  {t:"No one else thinks about you as much as you do",c:"mindset"},
  {t:"Sometimes people don't want to hear the truth because they don't want their illusions destroyed",c:"mindset"},
  {t:"Everything is beautiful depending on the situation",c:"mindset"},
  {t:"If you see beauty in something, don't wait for others to agree",c:"mindset"},
  {t:"Why is it that you search for your own beauty in the eyes of others?",c:"mindset"},
  {t:"Walk like the king, or walk like you don't care who the king is",c:"mindset"},
  {t:"It's crazy to you but regular to me",c:"mindset"},
  {t:"You're not stuck, you're just stagnant",c:"mindset"},
  {t:"It is not an evil thing to look at yourself with kindness — your life was never meant to be a punishment",c:"mindset"},
  {t:"I looked in your cup to see if you had enough; you looked in mine to check if I had more than you",c:"mindset"},
  {t:"You accept failure in the gym because you know it's optimal for growth, but for some reason you fear it in every other aspect of your life",c:"mindset"},
  {t:"You already know what to do, you're just negotiating with comfort",c:"mindset"},
  {t:"A locked door won't open no matter how long you stand at it",c:"mindset"},

  // AMBITION & PURPOSE
  {t:"If a man hasn't discovered something that he will live for, he isn't fit to live",c:"ambition"},
  {t:"Ambition without action becomes anxiety",c:"ambition"},
  {t:"Focus on you until the focus is on you",c:"ambition"},
  {t:"The best way to predict the future is to create it",c:"ambition"},
  {t:"Waiting for the right time is another way of wasting time",c:"ambition"},
  {t:"Success is not just about making money, it's about making a difference",c:"ambition"},
  {t:"Build the life you want, instead of trying to escape the life you have",c:"ambition"},
  {t:"People think they need the perfect conditions to start when in reality, starting is the perfect condition",c:"ambition"},
  {t:"How long are you going to wait before you demand the best of yourself?",c:"ambition"},
  {t:"The magic you are looking for is in the work you're avoiding",c:"ambition"},
  {t:"Suffer the pain of discipline, or suffer the pain of regret",c:"ambition"},
  {t:"Dreams are not what you see in your sleep — dreams are things which do not let you sleep",c:"ambition"},
  {t:"Dreams are useless if they stay on your pillow",c:"ambition"},
  {t:"There are billion-dollar ideas sitting in the ground from people who never took action",c:"ambition"},
  {t:"Your lack of commitment is an insult to the people who believe in you",c:"ambition"},
  {t:"How big would you dream if you knew you couldn't fail?",c:"ambition"},
  {t:"If you're not willing to do what it takes, you don't deserve success",c:"ambition"},
  {t:"Never sleep on the idea that visits you daily — that will be the one to change your life",c:"ambition"},
  {t:"Luck is what happens when preparation meets opportunity",c:"ambition"},
  {t:"Knowledge isn't free — you have to pay attention",c:"ambition"},
  {t:"Discipline is choosing between what you want now and what you want most",c:"ambition"},
  {t:"Your talent is God's gift to you; what you do with it is your gift back to God",c:"ambition"},
  {t:"Why be normal when you can be the best?",c:"ambition"},
  {t:"Don't say you can't do it, say you haven't done it yet",c:"ambition"},
  {t:"I cannot afford to give up. I don't have a backup — I am the backup",c:"ambition"},
  {t:"Next stop, the top",c:"ambition"},
  {t:"They call us dreamers, but we're the ones who don't sleep",c:"ambition"},
  {t:"I can't cry about having a lot on my plate when my goal was to eat",c:"ambition"},
  {t:"To be a star, you must burn",c:"ambition"},
  {t:"Good leaders make you believe in them, great leaders make you believe in you",c:"ambition"},
  {t:"A man who wants to lead an orchestra must turn his back on the crowd",c:"ambition"},
  {t:"The only difference between ordinary and extraordinary is that little extra",c:"ambition"},
  {t:"Earn it, so that no one ever tells you they gave it to you",c:"ambition"},
  {t:"Rise above the rest, or be buried beneath them",c:"ambition"},
  {t:"Genius ideas don't come from average minds",c:"ambition"},
  {t:"You are in danger of a life so comfortable and soft that you will die without ever realising your true potential",c:"ambition"},
  {t:"Never take constructive criticism from someone who hasn't constructed anything",c:"ambition"},
  {t:"Power is only given to those who lower themselves to pick it up",c:"ambition"},
  {t:"Compound interest is the 8th wonder of the world. He who understands it earns it, he who doesn't pays it",c:"ambition"},
  {t:"If you think the price of winning is too high, wait till you get the bill from regret — and that bill from regret is generational",c:"ambition"},
  {t:"The more you live like you are already who you want to become, the faster it will turn into a reality",c:"ambition"},
  {t:"It's your road and yours alone — others may walk it with you, but no one can walk it for you",c:"ambition"},
  {t:"If you live for people's acceptance, you'll die from their rejection",c:"ambition"},
  {t:"The graveyard is full of men who thought they had more time",c:"ambition"},
  {t:"There are graveyards full of people who thought they had more time",c:"ambition"},
  {t:"Do it because they said you couldn't",c:"ambition"},
  {t:"If you quit, then everyone was right about you",c:"ambition"},
  {t:"Only the educated are free",c:"ambition"},
  {t:"Twenty years from now you will be more disappointed by the things you didn't do than by the ones you did",c:"ambition"},
  {t:"Talent hits a target no one else can hit; genius hits a target no one else can see",c:"ambition"},
  {t:"Kill the tension before the tension kills you. Live life before life leaves you",c:"ambition"},
  {t:"If you were 30 failures away from your goal, how fast would you want to fail?",c:"ambition"},
  {t:"The fact that it is painful is proof that it is working",c:"ambition"},
  {t:"Stop letting your potential go to waste because you don't feel ready enough",c:"ambition"},
  {t:"You don't rise to your goals, you fall to your standards. Raise the floor, not the ceiling",c:"ambition"},
  {t:"You can't repay your father, but you can rise so high that the world respects the man who raised you",c:"ambition"},
  {t:"Never judge the future of a person by their current situation",c:"ambition"},
  {t:"When you're winning, you're not as good as you think you are. When you're losing, you're not as bad as you think you are",c:"ambition"},
  {t:"A man's ultimate goal is exclusivity — we don't want to build a permanent life with someone who treated themselves as temporary",c:"ambition"},

  // FAITH & SPIRITUALITY
  {t:"I looked in temples, churches, and mosques, but I found God in my heart",c:"faith"},
  {t:"A person chosen by God will never be chosen by humans",c:"faith"},
  {t:"Why doesn't God destroy all evil? Because none of us would be left",c:"faith"},
  {t:"When the world pushes you to your knees, you're in the perfect position to pray",c:"faith"},
  {t:"Some find God in the pit of their sins, others lose him on the throne of their blessings",c:"faith"},
  {t:"God is the name we give to the blanket we throw over the mystery to give it shape",c:"faith"},
  {t:"God did not put your beautiful soul on this planet so that you could listen to the enemy in your mind tell you that you aren't good enough",c:"faith"},
  {t:"If God made the world, I would not want to be that god. It is full of misery and distress that it breaks my heart",c:"faith"},
  {t:"Sometimes God breaks your heart to save your soul",c:"faith"},
  {t:"God saw me rushing life, so he humbled me and made me start over",c:"faith"},
  {t:"Both faith and fear demand you believe in something you can't see",c:"faith"},
  {t:"Sometimes God's blessing isn't in what he gives, but in what he takes",c:"faith"},
  {t:"If disloyalty was forgivable, the devil would be sitting next to God",c:"faith"},
  {t:"You know what my problem with religion is? Man. Like anything that has the potential to be beautiful, man will turn it into something ugly",c:"faith"},
  {t:"The road to heaven feels like hell, the road to hell feels like heaven",c:"faith"},
  {t:"If the gods listened to the prayers of all men, all humankind would quickly perish since they constantly pray for many evils to befall one another",c:"faith"},
  {t:"I don't know how I'll feel when I'm dead, but I don't want to regret the way I lived",c:"faith"},
  {t:"To know what is right and to choose to ignore it is the act of a coward",c:"faith"},
  {t:"You don't have a soul, you are a soul — you have a body",c:"faith"},
  {t:"Bad people turn to religion so they can gain the forgiveness of a being that is higher than the people they have wronged",c:"faith"},

  // HUMANITY & SOCIETY
  {t:"One apple fell and the world knows the meaning of gravity; millions of bodies fell and yet nobody knows the meaning of humanity",c:"humanity"},
  {t:"Birds born in a cage think flying is an illness",c:"humanity"},
  {t:"War is when your government tells you who your enemy is, revolution is when you figure it out yourself",c:"humanity"},
  {t:"Sometimes the biggest criminals write the laws",c:"humanity"},
  {t:"Your funeral is going to be more packed than your birthday because some people would rather see you on your back than on your feet",c:"humanity"},
  {t:"The only time most people think about injustice is when it happens to them",c:"humanity"},
  {t:"Is it wonder or conquest, the way we climb mountains just to plant flags at the top?",c:"humanity"},
  {t:"Humans invented mirrors, then started using filters because the mirror was too honest",c:"humanity"},
  {t:"Anyone who has ever looked into the glazed eyes of a soldier dying on the battlefield will think hard before starting a war",c:"humanity"},
  {t:"If you are silent about your pain, they will kill you and say you enjoyed it",c:"humanity"},
  {t:"The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion",c:"humanity"},
  {t:"War does not determine who is right, it determines who is left",c:"humanity"},
  {t:"Children: you spend the first two years of their life teaching them to walk and talk, and the next sixteen years telling them to sit down and shut up",c:"humanity"},
  {t:"An eye for an eye will only make the whole world blind",c:"humanity"},
  {t:"When the power of love overcomes the love of power, only then will there be a chance for true peace",c:"humanity"},
  {t:"People fear what they don't understand and hate what they can't conquer",c:"humanity"},
  {t:"We fight believing we're on the side of justice, but if the enemy believes the same, how do we know who's really right?",c:"humanity"},
  {t:"Educate the children and it won't be necessary to punish the men",c:"humanity"},
  {t:"Death usually brings people together, while life often keeps them apart",c:"humanity"},
  {t:"The best way to keep a prisoner is to make sure he never knows he's in prison",c:"humanity"},
  {t:"Society grows great when old men plant trees whose shade they know they shall never sit in",c:"humanity"},
  {t:"Truth doesn't always win in court — what wins in court becomes the truth",c:"humanity"},
  {t:"Justice delayed is justice denied",c:"humanity"},
  {t:"Children don't get traumatised because they get hurt; they get traumatised because they're alone with the hurt",c:"humanity"},
  {t:"If you hate a person, you hate something in them that is part of yourself. What isn't part of ourselves doesn't disturb us",c:"humanity"},
  {t:"Nothing strengthens authority so much as silence",c:"humanity"},
  {t:"Even if it's wrong, people will justify it if it benefits them",c:"humanity"},
  {t:"The smallest coffins are the heaviest",c:"humanity"},
  {t:"Everyone is jealous of what you've got, no one is jealous of how you got it",c:"humanity"},
  {t:"You can't change the people around you, but you can change the people around you",c:"humanity"},
  {t:"The living close the eyes of the dead, while the dead open the eyes of the living",c:"humanity"},
  {t:"You're going to die, it's a matter of time. The question is whether people are going to have good stories to tell about you when you're gone",c:"humanity"},
  {t:"If you planted a seed, would you dig it up every ten minutes to see if it's grown?",c:"humanity"},
  {t:"Mercy to the guilty is cruelty to the innocent",c:"humanity"},
  {t:"In the court of justice, both parties know the truth — it is the judge who is on trial",c:"humanity"},
  {t:"Every man dies, not every man really lives",c:"humanity"},
  {t:"You cannot conquer a free man — the most you can do is kill him",c:"humanity"},
  {t:"If you look at the people in your circle and you don't get inspired, you don't have a circle — you have a cage",c:"humanity"},
  {t:"The lesson of history is that no one learns",c:"humanity"},
  {t:"It is pointless to believe what you see if you only see what you believe",c:"humanity"},
  {t:"A man without money is a man without a voice. You could be the wisest, but if your pocket is empty, no one listens to you",c:"humanity"},
  {t:"If you have a big enough cage, you'll never know you're in one",c:"humanity"},
  {t:"An evil man will burn his own nation to the ground to rule over the ashes",c:"humanity"},

  // KINDNESS & GOODNESS
  {t:"Someone feels less alone because of my kindness",c:"kindness"},
  {t:"If you help someone and expect something in return, that is business, not kindness",c:"kindness"},
  {t:"There are certain people who make the world a better place just by being in it — you are one of those people",c:"kindness"},
  {t:"A candle never loses its light while lighting up another candle",c:"kindness"},
  {t:"The fact that you're still kind after all you've been through shows how strong you are",c:"kindness"},
  {t:"I helped a man climb a mountain, only to realise I too reached the top",c:"kindness"},
  {t:"Don't offer a lecture to a person who needs a hug",c:"kindness"},
  {t:"Treat people with your manners, not theirs",c:"kindness"},
  {t:"When one's actions are pure, the heart is satisfied even if no one sees",c:"kindness"},
  {t:"What we give doesn't always return, but what we give is always what we are",c:"kindness"},
  {t:"The world is cruel, therefore I won't be",c:"kindness"},
  {t:"People with a good heart never win. I think it's because people with a good heart aren't in it to win",c:"kindness"},
  {t:"Some stranger, somewhere, still remembers you because you were kind to them when no one else was",c:"kindness"},
  {t:"In this messed up world, I want to be the reason someone believes in pure hearts and kind souls",c:"kindness"},
  {t:"Don't stop being a good person because of bad people",c:"kindness"},
  {t:"Become so kind in life that when people meet you, they start to believe you were created by God, not society",c:"kindness"},
  {t:"Do it out of love and not for love",c:"kindness"},
  {t:"You're the exact reason someone still believes in the goodness of people — this world needs more people like you",c:"kindness"},
  {t:"The true reward for the deeds you have done is the deed itself being done",c:"kindness"},
  {t:"Sometimes the reason nothing good happens to you is because you are the good happening to others",c:"kindness"},
  {t:"No one is stronger than a man who knows the world and still chooses to be kind",c:"kindness"},
  {t:"Make your character so good that even the blind man can see your kindness and the deaf man can hear your kind words",c:"kindness"},
  {t:"From time to time, there arise among human beings people who exude love as naturally as the sun gives out heat",c:"kindness"},
  {t:"Cross oceans for people, climb mountains. Life is not about what you receive, it's about what you give",c:"kindness"},
  {t:"I do not abandon anyone, but I do not hold the hand of one who wishes to leave",c:"kindness"},
  {t:"And if I could, I'd hand you my easy days so that you wouldn't have to face a day of pain in your life",c:"kindness"},
  {t:"A flower does not think of competing with the flower next to it — it just blooms",c:"kindness"},
  {t:"If you feel pain, you're alive. If you feel other people's pain, you're a human being",c:"kindness"},
  {t:"Treat yourself like someone you are responsible for taking care of",c:"kindness"},
  {t:"If your compassion does not include yourself, it is incomplete",c:"kindness"},
  {t:"When someone is drowning, that is not the time to teach them how to swim",c:"kindness"},
  {t:"To the world you might be one person, but to one person you might be the world",c:"kindness"},
  {t:"We can easily forgive a child who is afraid of the dark; the real tragedy is when men are afraid of the light",c:"kindness"},
  {t:"If you only have 10% and you give 10%, you gave 100%",c:"kindness"},
  {t:"There's something beautiful about people who had every reason to become cruel, but chose softness anyway",c:"kindness"},
  {t:"Supporting another person's success will never ruin yours",c:"kindness"},
];

/* ── Storage (localStorage) ───────────────────────────────── */
const stored = (key) => { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch { return null; } };
const store  = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

/* ── Helpers ──────────────────────────────────────────────── */
const shuffle = arr => [...arr].sort(() => Math.random() - .5);

/* ── Toast ────────────────────────────────────────────────── */
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, []);
  return <div className="copied-toast">{msg}</div>;
}

/* ── Share ────────────────────────────────────────────────── */
/* ── Canvas image for Instagram ───────────────────────────── */
const SITE_URL = "https://theaurumvault.vercel.app"; // update after deployment

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" "), lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

async function generateQuoteImage(quoteText, format = "post") {
  await document.fonts.ready;
  const isStory = format === "story";
  const W = 1080, H = isStory ? 1920 : 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#080808"; ctx.fillRect(0, 0, W, H);

  const grd = ctx.createRadialGradient(W/2, H*.4, 0, W/2, H*.4, H*.65);
  grd.addColorStop(0, "rgba(201,168,76,.07)"); grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);

  const m = 55;
  ctx.strokeStyle = "rgba(201,168,76,.5)"; ctx.lineWidth = 2.5;
  ctx.strokeRect(m, m, W-m*2, H-m*2);
  ctx.strokeStyle = "rgba(201,168,76,.15)"; ctx.lineWidth = 1;
  ctx.strokeRect(m+14, m+14, W-(m+14)*2, H-(m+14)*2);

  const diamond = (x, y, s) => {
    ctx.save(); ctx.translate(x,y); ctx.rotate(Math.PI/4);
    ctx.fillStyle = "rgba(201,168,76,.6)"; ctx.fillRect(-s/2,-s/2,s,s); ctx.restore();
  };
  [m, W-m].forEach(x => [m, H-m].forEach(y => diamond(x, y, 9)));

  ctx.font = `italic bold 240px "EB Garamond", Georgia, serif`;
  ctx.fillStyle = "rgba(201,168,76,.08)"; ctx.textAlign = "left";
  ctx.fillText("\u201C", m+20, m+210);

  const pad = 140, textW = W-pad*2;
  let fs = quoteText.length<80?68:quoteText.length<140?58:quoteText.length<220?50:quoteText.length<300?43:37;
  if (isStory) fs = Math.round(fs*1.12);
  ctx.font = `italic ${fs}px "EB Garamond", Georgia, serif`;
  ctx.fillStyle = "#e8e0d0"; ctx.textAlign = "center";

  const lines = wrapText(ctx, quoteText, textW);
  const lineH = fs*1.65, totalH = lines.length*lineH;
  const startY = (H-totalH)/2-(isStory?60:20);
  lines.forEach((line,i) => ctx.fillText(line, W/2, startY+i*lineH));

  const divY = startY+totalH+50;
  const lg = ctx.createLinearGradient(W/2-140,0,W/2+140,0);
  lg.addColorStop(0,"transparent"); lg.addColorStop(.5,"#C9A84C"); lg.addColorStop(1,"transparent");
  ctx.strokeStyle = lg; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W/2-140,divY); ctx.lineTo(W/2+140,divY); ctx.stroke();

  ctx.font = `${isStory?34:28}px "Cinzel", Georgia, serif`;
  ctx.fillStyle = "rgba(201,168,76,.75)";
  ctx.fillText("THE AURUM VAULT", W/2, H-m-55);

  ctx.font = `italic ${isStory?24:20}px "EB Garamond", Georgia, serif`;
  ctx.fillStyle = "rgba(201,168,76,.38)";
  ctx.fillText("for the hurting \u00b7 for the healing \u00b7 for the hopeful", W/2, H-m-18);

  return canvas.toDataURL("image/png");
}

function downloadImg(dataUrl, name) {
  const a = document.createElement("a"); a.download = name; a.href = dataUrl; a.click();
}

/* ── ShareModal ───────────────────────────────────────────── */
const PLATFORMS = [
  { id:"copy",      label:"Copy Text",   bg:"#252525", border:"#555",    symbol:"⎘"  },
  { id:"native",    label:"Share…",      bg:"#252525", border:"#555",    symbol:"↗"  },
  { id:"whatsapp",  label:"WhatsApp",    bg:"#128C7E", border:"#25D366", symbol:"💬" },
  { id:"telegram",  label:"Telegram",    bg:"#0088CC", border:"#29A0DA", symbol:"✈️" },
  { id:"twitter",   label:"X",           bg:"#111",    border:"#555",    symbol:"𝕏"  },
  { id:"facebook",  label:"Facebook",    bg:"#1877F2", border:"#4EA3FF", symbol:"f"  },
  { id:"linkedin",  label:"LinkedIn",    bg:"#0A66C2", border:"#3E8FC9", symbol:"in" },
  { id:"pinterest", label:"Pinterest",   bg:"#E60023", border:"#FF3350", symbol:"P"  },
];

function ShareModal({ quote, onClose, setToast }) {
  const [igLoading, setIgLoading] = useState(null);
  const hasNative = !!navigator.share;
  const shareText = `"${quote.t}" — The Aurum Vault`;
  const enc = encodeURIComponent(shareText), url = encodeURIComponent(SITE_URL);
  const platforms = hasNative ? PLATFORMS : PLATFORMS.filter(p => p.id !== "native");

  const handlePlatform = async (id) => {
    if (id === "copy") {
      await navigator.clipboard.writeText(shareText);
      setToast("Copied to clipboard ✓"); onClose(); return;
    }
    if (id === "native") {
      try { await navigator.share({ title:"The Aurum Vault", text:shareText, url:SITE_URL }); } catch {}
      onClose(); return;
    }
    const links = {
      whatsapp:  `https://wa.me/?text=${enc}`,
      telegram:  `https://t.me/share/url?url=${url}&text=${enc}`,
      twitter:   `https://twitter.com/intent/tweet?text=${enc}`,
      facebook:  `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${enc}`,
      linkedin:  `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${enc}`,
    };
    if (links[id]) { window.open(links[id], "_blank"); onClose(); }
  };

  const handleIg = async (fmt) => {
    setIgLoading(fmt);
    try {
      const img = await generateQuoteImage(quote.t, fmt);
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        const w = window.open();
        w.document.write(`<html><head><meta name="viewport" content="width=device-width"><title>The Aurum Vault</title><style>body{margin:0;background:#080808;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px;box-sizing:border-box;font-family:sans-serif}img{max-width:100%;border-radius:8px}p{color:rgba(201,168,76,.7);font-size:14px;margin-top:16px;text-align:center;line-height:1.6}</style></head><body><img src="${img}"/><p>Press and hold the image,<br>then tap <strong>Save to Photos</strong></p></body></html>`);
        w.document.close();
        setToast("Image opened — press & hold to save ✓");
      } else {
        downloadImg(img, `aurum-vault-${fmt}.png`);
        setToast("Image saved ✓");
      }
      setTimeout(onClose, 800);
    } catch { setToast("Failed — please try again"); }
    setIgLoading(null);
  };

  const igBtnStyle = {
    display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.04)",
    border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"11px 14px",
    cursor:"pointer", transition:"all .2s", flex:1, textAlign:"left"
  };

  return (
    <div className="modal" onClick={e => { if (e.target.className?.includes?.("modal")) onClose(); }}>
      <div className="modal-box" style={{ maxWidth:460 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.3rem" }}>
          <div>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#C9A84C", letterSpacing:".14em", fontSize:".9rem" }}>SHARE THIS QUOTE</h3>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"rgba(220,210,190,.45)", fontSize:".85rem", marginTop:".2rem" }}>Let it reach someone who needs it</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,.35)", cursor:"pointer", fontSize:"1.3rem", lineHeight:1, padding:"2px 4px" }}>✕</button>
        </div>

        <div style={{ background:"rgba(201,168,76,.04)", border:"1px solid rgba(201,168,76,.13)", borderRadius:10, padding:".85rem 1.1rem", marginBottom:"1.3rem" }}>
          <p style={{ fontFamily:"'EB Garamond',serif", fontStyle:"italic", fontSize:"1rem", color:"#d4c9b0", lineHeight:1.65 }}>"{quote.t}"</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(platforms.length,4)},1fr)`, gap:"10px 6px", marginBottom:"1.4rem" }}>
          {platforms.map(p => (
            <button key={p.id} onClick={() => handlePlatform(p.id)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", background:"none", border:"none", padding:"4px" }}>
              <div style={{ width:50, height:50, borderRadius:13, background:p.bg, border:`1px solid ${p.border}55`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.25rem",
                transition:"transform .18s, box-shadow .18s", boxShadow:"0 2px 8px rgba(0,0,0,.4)" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.4)"; }}>
                <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:"#fff" }}>{p.symbol}</span>
              </div>
              <span style={{ fontFamily:"'Jost',sans-serif", fontSize:".66rem", color:"rgba(220,210,190,.55)", letterSpacing:".03em", textAlign:"center" }}>{p.label}</span>
            </button>
          ))}
        </div>

        <hr style={{ border:"none", height:1, background:"linear-gradient(90deg,transparent,rgba(201,168,76,.2),transparent)", marginBottom:"1.2rem" }} />

        <p style={{ fontFamily:"'Cinzel',serif", fontSize:".7rem", color:"rgba(201,168,76,.55)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:".8rem" }}>
          🖼️  Save as Image
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[
            {fmt:"post",  label:"Square (1080 × 1080)", sub:"Best for Instagram posts, WhatsApp, general sharing", icon:"⬛"},
            {fmt:"story", label:"Portrait (1080 × 1920)", sub:"Best for Instagram & WhatsApp stories", icon:"📱"},
          ].map(({fmt,label,sub,icon}) => (
            <button key={fmt} style={igBtnStyle} onClick={() => handleIg(fmt)} disabled={!!igLoading}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(201,168,76,.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}>
              <span style={{ fontSize:"1.5rem", flexShrink:0 }}>{icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:".85rem", color:"#e8e0d0", fontWeight:500, marginBottom:".2rem" }}>
                  {igLoading===fmt ? "Generating image…" : label}
                </div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:".69rem", color:"rgba(201,168,76,.45)", lineHeight:1.4 }}>{sub}</div>
              </div>
              {igLoading !== fmt && (
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:".72rem", color:"rgba(201,168,76,.6)", flexShrink:0 }}>↓ Save</span>
              )}
            </button>
          ))}
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:".78rem", color:"rgba(220,210,190,.28)", marginTop:".8rem", lineHeight:1.5, textAlign:"center" }}>
          On mobile, press and hold the image after it opens to save it to your photos.
        </p>
      </div>
    </div>
  );
}

/* ── QuoteCard ────────────────────────────────────────────── */
function QuoteCard({ quote, favs, toggleFav, setToast }) {
  const [shareOpen, setShareOpen] = useState(false);
  const cat = CATS[quote.c];
  const isFav = favs.includes(quote.t);
  return (
    <>
      <div className="q-card" style={{ background:"rgba(255,255,255,.03)", border:`1px solid rgba(255,255,255,.07)`, borderTop:`2px solid ${cat.color}`, borderRadius:12, padding:"1.3rem 1.4rem" }}>
        <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"1.05rem", lineHeight:1.75, color:"#e8e0d0", padding:"4px 0 12px" }}>
          {quote.t}
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,.07)", paddingTop:10, gap:8, flexWrap:"wrap" }}>
          <span className="pill" style={{ background:`${cat.color}22`, color:cat.accent, border:`1px solid ${cat.color}44` }}>
            {cat.icon} {cat.label}
          </span>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <button className="btn-ghost" onClick={() => setShareOpen(true)} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span>↗</span> Share
            </button>
            <button className="fav-btn" onClick={() => toggleFav(quote.t)} style={{ color: isFav ? "#E8C97A" : "rgba(255,255,255,.3)", fontSize:"1.1rem" }}>
              {isFav ? "★" : "☆"}
            </button>
          </div>
        </div>
      </div>
      {shareOpen && <ShareModal quote={quote} onClose={() => setShareOpen(false)} setToast={setToast} />}
    </>
  );
}

/* ── HomePage ─────────────────────────────────────────────── */
function HomePage({ setView, allQuotes, favs, toggleFav, setToast }) {
  const daily = useMemo(() => shuffle(allQuotes).slice(0, 4), []);
  return (
    <div>
      {/* Hero */}
      <div style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"4rem 1.5rem 3rem", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 30%, rgba(201,168,76,.07) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div className="ornament fade-up" style={{ fontSize:".9rem", marginBottom:"1.5rem" }}>✦ ✦ ✦</div>
        <h1 className="fade-up fade-up-d1" style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(2.6rem,8vw,5.5rem)", fontWeight:700, letterSpacing:".12em", color:"#C9A84C", animation:"glow 4s ease-in-out infinite, fadeUp .6s .1s both" }}>
          THE AURUM VAULT
        </h1>
        <div className="fade-up fade-up-d2" style={{ width:160, height:1, background:"linear-gradient(90deg,transparent,#C9A84C,transparent)", margin:"1.4rem auto" }} />
        <p className="fade-up fade-up-d3" style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(1rem,2.5vw,1.2rem)", color:"rgba(201,168,76,.7)", letterSpacing:".1em", marginBottom:"2.5rem" }}>
          for the hurting &nbsp;·&nbsp; for the healing &nbsp;·&nbsp; for the hopeful
        </p>

        {/* Intro */}
        <div className="fade-up fade-up-d4" style={{ maxWidth:680, background:"rgba(201,168,76,.04)", border:"1px solid rgba(201,168,76,.13)", borderRadius:16, padding:"2rem 2.2rem", margin:"0 auto 3rem" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.08rem,2.3vw,1.28rem)", lineHeight:1.9, color:"#d4c9b0", fontStyle:"italic", fontWeight:300 }}>
            Some collections begin quietly — a single sentence saved in the small hours of a hard night, a few words that knew something we hadn't said aloud yet. <span style={{ color:"#C9A84C", fontWeight:400 }}>The Aurum Vault</span> grew that way, one quote at a time, gathered <em>for the hurting, the healing, and the hopeful.</em> Every line here was chosen because it earned its place: because it said the unsayable with grace, offered a hand in the dark, or reminded someone they weren't alone in what they carry. These are not just quotes. They are proof — that others have stood where you are standing, that beauty can be spoken from the deepest places, and that sometimes, a single sentence is all it takes to remind you why you should stay.{" "}
            <span style={{ color:"#C9A84C" }}>Come here as often as you need to. You will always find something waiting.</span>
          </p>
        </div>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
          <button className="btn-gold" style={{ padding:"13px 32px", borderRadius:8, fontSize:".9rem", letterSpacing:".08em" }} onClick={() => setView({ page:"search" })}>
            Search Quotes
          </button>
          <button className="btn-outline" style={{ padding:"13px 32px", borderRadius:8, fontSize:".9rem", letterSpacing:".08em" }} onClick={() => setView({ page:"favs" })}>
            ★ My Favourites
          </button>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding:"3rem 1.5rem 2rem", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.2rem,3vw,1.7rem)", color:"#C9A84C", letterSpacing:".18em" }}>EXPLORE BY MOOD</h2>
          <hr className="gold-divider" style={{ maxWidth:280, margin:"1rem auto 0" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))", gap:16 }}>
          {Object.entries(CATS).map(([key, cat]) => {
            const count = allQuotes.filter(q => q.c === key).length;
            return (
              <div key={key} className="cat-card" onClick={() => setView({ page:"category", cat:key })}
                style={{ background:cat.bg, border:`1px solid ${cat.color}33`, borderRadius:14, padding:"1.4rem 1.5rem", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-10, right:-10, fontSize:"4rem", opacity:.08 }}>{cat.icon}</div>
                <div style={{ fontSize:"1.6rem", marginBottom:".6rem" }}>{cat.icon}</div>
                <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:".8rem", letterSpacing:".12em", color:cat.accent, marginBottom:".5rem", textTransform:"uppercase" }}>{cat.label}</h3>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:".95rem", color:"rgba(220,210,190,.65)", lineHeight:1.5, marginBottom:".8rem" }}>{cat.desc}</p>
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:".72rem", color:cat.accent, opacity:.7 }}>{count} quotes</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily picks */}
      <div style={{ padding:"2rem 1.5rem 4rem", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1rem,2.5vw,1.4rem)", color:"#C9A84C", letterSpacing:".18em" }}>QUOTES FOR TODAY</h2>
          <hr className="gold-divider" style={{ maxWidth:200, margin:".8rem auto 0" }} />
        </div>
        <div className="masonry">
          {daily.map((q, i) => <QuoteCard key={i} quote={q} favs={favs} toggleFav={toggleFav} setToast={setToast} />)}
        </div>
      </div>
    </div>
  );
}

/* ── CategoryPage ─────────────────────────────────────────── */
function CategoryPage({ catKey, allQuotes, favs, toggleFav, setToast, setView }) {
  const cat = CATS[catKey];
  const quotes = useMemo(() => allQuotes.filter(q => q.c === catKey), [catKey, allQuotes]);
  const [sort, setSort] = useState("default");
  const sorted = useMemo(() => sort === "random" ? shuffle(quotes) : quotes, [sort, quotes]);
  return (
    <div>
      <div style={{ background:`linear-gradient(180deg, ${cat.color}22 0%, transparent 100%)`, padding:"3.5rem 1.5rem 2rem", textAlign:"center", borderBottom:`1px solid ${cat.color}33` }}>
        <button className="btn-ghost" style={{ marginBottom:"1.5rem" }} onClick={() => setView({ page:"home" })}>← Back</button>
        <div style={{ fontSize:"2.5rem", marginBottom:".5rem" }}>{cat.icon}</div>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.5rem,4vw,2.5rem)", color:cat.accent, letterSpacing:".15em", marginBottom:".7rem" }}>{cat.label.toUpperCase()}</h1>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1.15rem", color:"rgba(220,210,190,.6)", marginBottom:"1.2rem" }}>{cat.desc}</p>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <button className="btn-ghost" onClick={() => setSort("default")} style={{ borderColor:sort==="default"?cat.accent:undefined, color:sort==="default"?cat.accent:undefined }}>Default</button>
          <button className="btn-ghost" onClick={() => setSort("random")} style={{ borderColor:sort==="random"?cat.accent:undefined, color:sort==="random"?cat.accent:undefined }}>Shuffle ✦</button>
        </div>
      </div>
      <div style={{ padding:"2rem 1.5rem 4rem", maxWidth:1200, margin:"0 auto" }}>
        <div className="masonry">
          {sorted.map((q, i) => <QuoteCard key={i} quote={q} favs={favs} toggleFav={toggleFav} setToast={setToast} />)}
        </div>
      </div>
    </div>
  );
}

/* ── SearchPage ───────────────────────────────────────────── */
function SearchPage({ allQuotes, favs, toggleFav, setToast, setView }) {
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const results = useMemo(() => {
    let r = allQuotes;
    if (catFilter !== "all") r = r.filter(x => x.c === catFilter);
    if (q.trim()) r = r.filter(x => x.t.toLowerCase().includes(q.toLowerCase()));
    return r;
  }, [q, catFilter, allQuotes]);
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"3rem 1.5rem" }}>
      <button className="btn-ghost" style={{ marginBottom:"1.5rem" }} onClick={() => setView({ page:"home" })}>← Back</button>
      <h2 style={{ fontFamily:"'Cinzel',serif", color:"#C9A84C", fontSize:"clamp(1.2rem,3vw,1.7rem)", letterSpacing:".15em", marginBottom:"1.5rem" }}>SEARCH QUOTES</h2>
      <input className="s-input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by keyword or phrase…" style={{ marginBottom:"1rem" }} />
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"2rem" }}>
        <button className="btn-ghost" onClick={() => setCatFilter("all")} style={{ borderColor:catFilter==="all"?"#C9A84C":undefined, color:catFilter==="all"?"#C9A84C":undefined }}>All</button>
        {Object.entries(CATS).map(([k,c]) => (
          <button key={k} className="btn-ghost" onClick={() => setCatFilter(k)} style={{ borderColor:catFilter===k?c.accent:undefined, color:catFilter===k?c.accent:undefined }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>
      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".8rem", color:"rgba(255,255,255,.35)", marginBottom:"1.5rem" }}>{results.length} quote{results.length!==1?"s":""} found</p>
      {results.length > 0
        ? <div className="masonry">{results.map((q,i) => <QuoteCard key={i} quote={q} favs={favs} toggleFav={toggleFav} setToast={setToast} />)}</div>
        : <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"rgba(255,255,255,.3)", fontSize:"1.1rem", textAlign:"center", marginTop:"3rem" }}>No quotes found. Try different words.</p>
      }
    </div>
  );
}

/* ── FavsPage ─────────────────────────────────────────────── */
function FavsPage({ allQuotes, favs, toggleFav, setToast, setView }) {
  const favQuotes = allQuotes.filter(q => favs.includes(q.t));
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"3rem 1.5rem" }}>
      <button className="btn-ghost" style={{ marginBottom:"1.5rem" }} onClick={() => setView({ page:"home" })}>← Back</button>
      <h2 style={{ fontFamily:"'Cinzel',serif", color:"#C9A84C", fontSize:"clamp(1.2rem,3vw,1.7rem)", letterSpacing:".15em", marginBottom:".5rem" }}>★ MY FAVOURITES</h2>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"rgba(220,210,190,.5)", fontSize:"1rem", marginBottom:"2rem" }}>
        {favQuotes.length > 0 ? `${favQuotes.length} quotes saved` : "You haven't saved any quotes yet"}
      </p>
      {favQuotes.length > 0
        ? <div className="masonry">{favQuotes.map((q,i) => <QuoteCard key={i} quote={q} favs={favs} toggleFav={toggleFav} setToast={setToast} />)}</div>
        : <div style={{ textAlign:"center", padding:"4rem 1rem" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem", opacity:.3 }}>☆</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"rgba(255,255,255,.3)", fontSize:"1.2rem" }}>Tap the star on any quote to save it here</p>
          </div>
      }
    </div>
  );
}

/* ── AdminPanel ───────────────────────────────────────────── */
function AdminPanel({ onClose, extraQuotes, setExtraQuotes, setToast }) {
  const [pw, setPw] = useState(""); const [authed, setAuthed] = useState(false);
  const [text, setText] = useState(""); const [cat, setCat] = useState("wisdom"); const [err, setErr] = useState("");
  const login = () => { if (pw === ADMIN_PASSWORD) { setAuthed(true); setErr(""); } else setErr("Incorrect password."); };
  const addQuote = () => {
    if (!text.trim()) { setErr("Quote text cannot be empty."); return; }
    const updated = [...extraQuotes, { t:text.trim(), c:cat }];
    setExtraQuotes(updated); store("av_extra_quotes", updated);
    setText(""); setErr(""); setToast("Quote added ✓");
  };
  const removeQuote = (idx) => {
    const updated = extraQuotes.filter((_,i) => i !== idx);
    setExtraQuotes(updated); store("av_extra_quotes", updated); setToast("Quote removed");
  };
  return (
    <div className="modal" onClick={e => e.target.className.includes?.("modal") && onClose()}>
      <div className="modal-box">
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#C9A84C", letterSpacing:".15em", marginBottom:"1.2rem", fontSize:"1rem" }}>ADMIN PANEL</h3>
        {!authed ? (
          <div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"rgba(220,210,190,.6)", marginBottom:"1rem" }}>Enter your admin password to add quotes.</p>
            <input className="admin-input" type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==="Enter"&&login()} style={{ marginBottom:".8rem" }} />
            {err && <p style={{ color:"#fb7185", fontSize:".8rem", marginBottom:".8rem" }}>{err}</p>}
            <div style={{ display:"flex", gap:8 }}>
              <button className="btn-gold" style={{ padding:"10px 24px", borderRadius:8, fontSize:".85rem" }} onClick={login}>Enter</button>
              <button className="btn-outline" style={{ padding:"10px 20px", borderRadius:8, fontSize:".85rem" }} onClick={onClose}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <label style={{ display:"block", fontFamily:"'Jost'", fontSize:".75rem", color:"rgba(201,168,76,.7)", letterSpacing:".1em", marginBottom:".5rem", textTransform:"uppercase" }}>Quote Text</label>
            <textarea className="admin-input" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="Type your quote here…" style={{ resize:"vertical", marginBottom:".8rem" }} />
            <label style={{ display:"block", fontFamily:"'Jost'", fontSize:".75rem", color:"rgba(201,168,76,.7)", letterSpacing:".1em", marginBottom:".5rem", textTransform:"uppercase" }}>Category</label>
            <select className="admin-input" value={cat} onChange={e => setCat(e.target.value)} style={{ marginBottom:"1rem" }}>
              {Object.entries(CATS).map(([k,c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
            </select>
            {err && <p style={{ color:"#fb7185", fontSize:".8rem", marginBottom:".8rem" }}>{err}</p>}
            <div style={{ display:"flex", gap:8, marginBottom:"1.5rem" }}>
              <button className="btn-gold" style={{ padding:"10px 24px", borderRadius:8, fontSize:".85rem" }} onClick={addQuote}>Add Quote</button>
              <button className="btn-outline" style={{ padding:"10px 20px", borderRadius:8, fontSize:".85rem" }} onClick={onClose}>Done</button>
            </div>
            {extraQuotes.length > 0 && (
              <div>
                <hr className="gold-divider" style={{ marginBottom:"1rem" }} />
                <p style={{ fontFamily:"'Jost'", fontSize:".75rem", color:"rgba(201,168,76,.6)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:".8rem" }}>Your Added Quotes ({extraQuotes.length})</p>
                {extraQuotes.map((q,i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,.04)", borderRadius:8, padding:".7rem 1rem", marginBottom:".5rem", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                    <p style={{ fontFamily:"'EB Garamond',serif", fontSize:".9rem", color:"#d4c9b0", flex:1, lineHeight:1.5 }}>{q.t}</p>
                    <button className="btn-ghost" style={{ flexShrink:0, color:"#fb7185", borderColor:"#fb718544", fontSize:".7rem" }} onClick={() => removeQuote(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Nav ──────────────────────────────────────────────────── */
function Nav({ view, setView, setAdminOpen }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(8,8,8,.95)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(201,168,76,.1)", padding:"1rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
      <span style={{ fontFamily:"'Cinzel',serif", fontSize:".85rem", letterSpacing:".18em", color:"#C9A84C", cursor:"pointer" }} onClick={() => setView({ page:"home" })}>THE AURUM VAULT</span>
      <div style={{ display:"flex", gap:"1.2rem", alignItems:"center", flexWrap:"wrap" }}>
        <span className={`nav-link ${view.page==="home"?"active":""}`} onClick={() => setView({ page:"home" })}>Home</span>
        <span className={`nav-link ${view.page==="search"?"active":""}`} onClick={() => setView({ page:"search" })}>Search</span>
        <span className={`nav-link ${view.page==="favs"?"active":""}`} onClick={() => setView({ page:"favs" })}>★ Saved</span>
        <span className="nav-link" onClick={() => setAdminOpen(true)}>Admin</span>
      </div>
    </nav>
  );
}

/* ── App ──────────────────────────────────────────────────── */
export default function AurumVault() {
  const [view, setView]               = useState({ page:"home" });
  const [favs, setFavs]               = useState(() => stored("av_favs") || []);
  const [extraQuotes, setExtraQuotes] = useState(() => stored("av_extra_quotes") || []);
  const [adminOpen, setAdminOpen]     = useState(false);
  const [toast, setToast]             = useState(null);

  const allQuotes = useMemo(() => [...BASE_QUOTES, ...extraQuotes], [extraQuotes]);

  const toggleFav = useCallback((text) => {
    setFavs(prev => {
      const next = prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text];
      store("av_favs", next);
      return next;
    });
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2100); };
  const props = { allQuotes, favs, toggleFav, setToast:showToast, setView };

  return (
    <div style={{ minHeight:"100vh", background:"var(--black)" }}>
      <Nav view={view} setView={setView} setAdminOpen={setAdminOpen} />
      {view.page==="home"     && <HomePage {...props} />}
      {view.page==="category" && <CategoryPage catKey={view.cat} {...props} />}
      {view.page==="search"   && <SearchPage {...props} />}
      {view.page==="favs"     && <FavsPage {...props} />}
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} extraQuotes={extraQuotes} setExtraQuotes={setExtraQuotes} setToast={showToast} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <footer style={{ borderTop:"1px solid rgba(201,168,76,.1)", padding:"2rem 1.5rem", textAlign:"center" }}>
        <p style={{ fontFamily:"'Cinzel',serif", color:"rgba(201,168,76,.4)", fontSize:".7rem", letterSpacing:".2em" }}>THE AURUM VAULT</p>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"rgba(255,255,255,.2)", fontSize:".85rem", marginTop:".4rem" }}>for the hurting · for the healing · for the hopeful</p>
      </footer>
    </div>
  );
}
