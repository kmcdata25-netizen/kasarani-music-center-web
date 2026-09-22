(() => {
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.site-nav');

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (!menuToggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    header.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    header.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Dynamically sync latest version information from GitHub releases
  fetch('https://raw.githubusercontent.com/kmcdata25-netizen/kasarani-app-releases/main/version.json')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data) return;
      if (data.apk_url) {
        document.querySelectorAll('a[data-apk-download]').forEach((el) => {
          el.href = data.apk_url;
        });
      }
      if (data.latest_version) {
        const badge = document.querySelector('.app-badge');
        if (badge) {
          badge.textContent = `Official Release v${data.latest_version}`;
        }
      }
    })
    .catch(() => {
      // Fallback
    });

  // ==============================================================================
  // KMC AI ASSISTANT ("MAESTRO") WIDGET CONTROLLER
  // ==============================================================================
  const chatWidget = document.getElementById('chat-widget');
  const chatLauncher = document.getElementById('chat-launcher');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const quickChips = document.querySelectorAll('.quick-chip');

  if (chatLauncher && chatWindow) {
    // Knowledge Base Topics
    const kmcKnowledge = [
      {
        id: 'fees',
        keywords: ['fee', 'fees', 'cost', 'price', 'pricing', 'pay', 'charges', 'rates', 'package', 'mpesa'],
        answer: 'KMC tuition structures are transparent and accessible:\n• Individual 1-on-1 Hourly Lesson: KSh 1,000/hr\n• Monthly Starter Bundle (4 sessions): KSh 3,800\n• Full Term Syllabi (12–24 lessons): Theory KSh 8,000 | Drums KSh 10,000 | Vocals KSh 11,000 | Guitar KSh 12,000 | Piano KSh 14,000–15,000 | Audio Engineering KSh 16,000–20,000.\nPayments are accepted via M-Pesa directly in the student app!'
      },
      {
        id: 'instruments',
        keywords: ['instrument', 'instruments', 'what do you teach', 'programs', 'courses', 'classes', 'learn', 'offer'],
        answer: 'KMC offers structured training in 8 disciplines:\n1. Piano & Keyboard (Classical, Jazz voicings, Gospel keys)\n2. Guitar & Strings (Acoustic fingerstyle, Electric, Bass, Violin)\n3. Vocal Technique & Performance (Belting, range, stagecraft)\n4. Drums & African Percussion (Traditional polyrhythms & modern kit)\n5. Music Production & Sound Engineering (Logic Pro, FL Studio, mixing)\n6. DJ Arts & Beat Performance (Beatmatching, live sets)\n7. Music Theory & Sight Reading (ABRSM & Trinity prep)\n8. African Dance & Stage Choreography'
      },
      {
        id: 'location',
        keywords: ['location', 'where', 'address', 'directions', 'find you', 'hours', 'time', 'open', 'close', 'schedule', 'days'],
        answer: 'KMC is located in Kasarani, Nairobi, Kenya along the Thika Road corridor near Kasarani Sports View and Seasons.\n\nOpening Hours:\n• Monday to Saturday: 8:00 AM – 7:00 PM\n• Sundays: Masterclasses & booked rehearsals.\nBoth in-person studio lessons and virtual online sessions are available!'
      },
      {
        id: 'piano',
        keywords: ['piano', 'keyboard', 'keys', 'jazz piano', 'contemporary keys', 'mwangi'],
        answer: 'Our Piano Department is led by Prof. J. Mwangi. We cover hand independence, rootless jazz voicings (Type A/B shells), contemporary gospel movements (2-5-1, 7-3-6), and ABRSM / Trinity practical grade exam preparation (Grades 1–8).'
      },
      {
        id: 'guitar',
        keywords: ['guitar', 'strings', 'acoustic', 'electric', 'bass', 'violin'],
        answer: 'Our Guitar & Strings curriculum covers acoustic percussive fingerstyle (thumb slap, wrist thump), electric lead & rhythm improvisation, bass guitar pocket locking, and violin posture, intonation, and bowing.'
      },
      {
        id: 'vocals',
        keywords: ['vocal', 'vocals', 'sing', 'singing', 'voice', 'breath', 'belting'],
        answer: 'Our Vocal Department focuses on diaphragmatic breath compression, chest-to-mixed voice transitions, safe belting without strain, pitch accuracy, vibrato control, and confident stage performance.'
      },
      {
        id: 'drums',
        keywords: ['drum', 'drums', 'drumming', 'percussion', 'rhythm', 'beat'],
        answer: 'Mentored by the Nairobi Rhythm Section, students master traditional East African polyrhythms, four-way limb independence, paradiddle rudiments, and playing with metronome click tracks.'
      },
      {
        id: 'production',
        keywords: ['production', 'audio', 'sound engineering', 'recording', 'mixing', 'mastering', 'studio', 'fl studio', 'logic'],
        answer: 'Spearheaded by Studio Director Kimani: acoustic tracking, multi-microphone placement, signal flow, EQ, compression, stem mixing, and digital mastering for streaming platforms in our professional studio.'
      },
      {
        id: 'exams',
        keywords: ['exam', 'exams', 'certificate', 'certification', 'abrsm', 'trinity', 'rockschool', 'grade'],
        answer: 'KMC is an accredited preparation center for ABRSM (Grades 1–8 Practical & Theory), Trinity College London, and Rockschool (RSL). Our students hold a 98% pass rate with Distinction and Merit honors!'
      },
      {
        id: 'admissions',
        keywords: ['admit', 'admission', 'enroll', 'enrollment', 'register', 'sign up', 'join', 'kids', 'adults', 'how to'],
        answer: 'Enrollment is open year-round for all ages (kids from 4+, teens, adults, and worship teams)!\n1. Download our Android student app on this page\n2. Create an account and verify your email\n3. Select your course and complete payment via M-Pesa to book your teacher.\nBeginners are warmly welcomed!'
      },
      {
        id: 'contact',
        keywords: ['contact', 'phone', 'email', 'call', 'reach', 'whatsapp', 'office', 'admin'],
        answer: 'You can reach Kasarani Music Center directly:\n• Email: kmcdata25@gmail.com\n• Location: Kasarani, Nairobi (off Thika Road corridor)\n• Hours: Monday – Saturday, 8:00 AM – 7:00 PM\nWe look forward to welcoming you to the KMC family!'
      }
    ];

    let hasGreeted = false;

    const appendMessage = (text, isUser = false) => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--bot'}`;
      bubble.innerHTML = text.replace(/\n/g, '<br>');

      const meta = document.createElement('span');
      meta.className = 'chat-bubble__meta';
      const now = new Date();
      meta.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      bubble.appendChild(meta);

      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const showTypingIndicator = () => {
      const typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.id = 'chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      chatMessages.appendChild(typing);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return typing;
    };

    const removeTypingIndicator = () => {
      const typing = document.getElementById('chat-typing');
      if (typing) typing.remove();
    };

    // Gemini API Key for KMC Maestro
    const GEMINI_API_KEY = atob('QVEuQWI4Uk42Sk9Ib3lUSE9hNk5Zc1JlR3hXckdERTAxRV8xTlNXVGNJc0NjOVhXYmM5c2c=');
    const conversationHistory = [];

    const formatMarkdown = (text) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    };

    const callGeminiApi = async (query) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
      const systemInstruction = 
        'You are "Maestro", the friendly, knowledgeable, and inspiring AI Music Tutor for Kasarani Music Center (KMC) in Nairobi, Kenya. ' +
        'Tagline: "Passion to Profession". Location: Kasarani, Nairobi (off Thika Road corridor). Email: kmcdata25@gmail.com. ' +
        'Faculty & Disciplines: Piano & Keys (Prof. J. Mwangi), Guitar & Strings, Vocal Coaching, African Percussion & Drums (Nairobi Rhythm Section), ' +
        'Music Production & Sound Engineering (Studio Director Kimani), DJ Arts, Music Theory (Dean Wanjala), African Dance. ' +
        'Fees: 1-on-1 private lesson KSh 1,000/hr, 4-session starter bundle KSh 3,800, full term courses KSh 8,000–20,000. ' +
        'Exams: ABRSM, Trinity, Rockschool. Payments via M-Pesa. Open Monday-Saturday 8 AM - 7 PM. ' +
        'Provide helpful, inspiring, concise answers. Avoid decorative emojis.';

      const payload = {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [
          ...conversationHistory.slice(-6),
          { role: 'user', parts: [{ text: query }] }
        ]
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('API status: ' + res.status);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No candidate text');
      return text;
    };

    const answerQuery = async (query) => {
      showTypingIndicator();

      try {
        const aiText = await callGeminiApi(query);
        conversationHistory.push({ role: 'user', parts: [{ text: query }] });
        conversationHistory.push({ role: 'model', parts: [{ text: aiText }] });
        removeTypingIndicator();
        appendMessage(formatMarkdown(aiText));
        return;
      } catch (err) {
        console.warn('Gemini API notice: falling back to local KMC knowledge base', err);
      }

      // Offline / Fallback Matcher
      const clean = query.trim().toLowerCase();
      let bestMatch = null;
      let highestScore = 0;

      for (const topic of kmcKnowledge) {
        let score = 0;
        for (const kw of topic.keywords) {
          if (clean === kw) {
            score += 10;
          } else if (clean.includes(kw)) {
            score += (kw.length >= 4) ? 6 : 3;
          }
        }
        if (score > highestScore) {
          highestScore = score;
          bestMatch = topic;
        }
      }

      setTimeout(() => {
        removeTypingIndicator();
        if (bestMatch && highestScore >= 3) {
          appendMessage(bestMatch.answer);
        } else {
          appendMessage(
            'Welcome to Kasarani Music Center ("Passion to Profession")!\n\n' +
            'We provide practical training in Piano, Guitar, Vocals, Drums, Sound Engineering, and Music Theory in Kasarani, Nairobi.\n\n' +
            'Hourly lessons start from KSh 1,000/hr. You can choose one of the topics below or email us at kmcdata25@gmail.com!'
          );
        }
      }, 300);
    };

    const openChat = () => {
      chatWindow.classList.add('is-open');
      chatWindow.setAttribute('aria-hidden', 'false');
      chatLauncher.setAttribute('aria-expanded', 'true');
      if (!hasGreeted) {
        hasGreeted = true;
        appendMessage('Hello! I am Maestro, your Kasarani Music Center AI Assistant. How can I help you today? Ask me anything about our lessons, tuition fees, schedules, or choose a topic below.');
      }
      chatInput.focus();
    };

    const closeChat = () => {
      chatWindow.classList.remove('is-open');
      chatWindow.setAttribute('aria-hidden', 'true');
      chatLauncher.setAttribute('aria-expanded', 'false');
    };

    chatLauncher.addEventListener('click', () => {
      if (chatWindow.classList.contains('is-open')) {
        closeChat();
      } else {
        openChat();
      }
    });

    chatClose.addEventListener('click', closeChat);

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;
      appendMessage(val, true);
      chatInput.value = '';
      answerQuery(val);
    });

    quickChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query') || chip.textContent;
        appendMessage(query, true);
        answerQuery(query);
      });
    });
  }
})();


