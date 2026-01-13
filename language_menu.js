(function () {

    // Inject styles
    const style = document.createElement("style");
    style.textContent = `
        #top_menu{
        list-style-type: none;
        }
        
        .lang-switcher {
        display: inline-block;
        margin-top: 1.5em;
        margin-bottom: 1.5em;
        }

        .lang-dropdown {
        position: relative;
        display: inline-block;
        }

        .lang-option {
        color: black !important;
        }

        .lang-btn {
        background: none;
        border: 1px solid rgba(255, 255, 255, 0.5);
        color: white;
        padding: .5em;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        }

        .lang-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        }

        .lang-btn img {
        width: 20px;
        margin-right: 8px;
        }

        .lang-dropdown-content {
        display: none;
        position: absolute;
        background: white;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        border-radius: 4px;
        overflow: hidden;
        padding: .5em;
        width: 8em;
        }

        .lang-dropdown-content a {
        color: #333;
        padding: 10px 15px;
        text-decoration: none;
        display: flex;
        align-items: center;
        transition: background 0.3s ease;
        }

        .lang-dropdown-content a:hover {
        background: #f5f5f5;
        }

        .lang-dropdown-content a img {
        width: 20px;
        margin-right: 10px;
        }

        .lang-dropdown:hover .lang-dropdown-content {
        display: block;
        }

        html[dir="rtl"] .lang-btn {
        margin-right: 0px;
        margin-left: 0;
        }

        html[dir="rtl"] .lang-btn img {
        margin-right: 0;
        margin-left: 8px;
        }

        .ar { display: none; }
    `;
    document.head.appendChild(style);

    // Create button
    const language_menu_li = document.createElement("li");

    language_menu_li.innerHTML = `
            <li class="lang-switcher">
                <div class="lang-dropdown">
                    <button class="lang-btn" id="current-lang-btn">
                    <img src="https://flagcdn.com/w20/gb.png" id="current-flag" alt="English">
                    <span id="current-lang">EN</span>
                    </button>
                    <div class="lang-dropdown-content">
                    <a href="#" class="lang-option" data-lang="en">
                        <img src="https://flagcdn.com/w20/gb.png" alt="English"> English
                    </a>
                    <a href="#" class="lang-option" data-lang="ar">
                        <img src="https://flagcdn.com/w20/sa.png" alt="العربية"> العربية
                    </a>
                    </div>
                </div>
            </li>
        `;

    // Append to existing menu
    const menu = document.getElementById("top_menu");
    if (menu) {
        menu.appendChild(language_menu_li);
    }

})()

const domReady = new Promise(resolve => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
    } else {
        resolve();
    }
});

// Cookie functions
function setCookie(name, value, days) {
    // Actually using localStorage
    localStorage.setItem(name, value);
}

function getCookie(name) {
    const value = localStorage.getItem(name);
    return value;
}

function showClass(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "inline"; // or "inline", "flex", etc.
    }
}

function hideClass(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
}

domReady.then(() => {
    // Core translation function
    function loadLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);

        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');
            showClass("ar");
            hideClass("en");
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('rtl');
            showClass("en");
            hideClass("ar");
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations?.[lang]?.[key]) {
                el.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations?.[lang]?.[key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });

        const currentFlag = document.getElementById('current-flag');
        const currentLangText = document.getElementById('current-lang');

        if (lang === 'ar') {
            currentFlag.src = 'https://flagcdn.com/w20/sa.png';
            currentFlag.alt = 'العربية';
            currentLangText.textContent = 'AR';
        } else {
            currentFlag.src = 'https://flagcdn.com/w20/gb.png';
            currentFlag.alt = 'English';
            currentLangText.textContent = 'EN';
        }

        setCookie('preferred-language', lang, 30);
    }

    // ✅ INIT RUNS IMMEDIATELY (not inside DOMContentLoaded)
    const savedLang = getCookie('preferred-language');
    const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    loadLanguage(savedLang || browserLang);

    // ✅ Click handlers now attach correctly
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', e => {
            e.preventDefault();
            loadLanguage(option.dataset.lang);
        });
    });
});


