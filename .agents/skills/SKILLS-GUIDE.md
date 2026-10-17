# راهنمای کامل Skillها

این فایل راهنمایی مفصل از تمام Skillهای پروژه است؛ طوری نوشته شده که با خواندنش دقیقاً بفهمید هر Skill چه کاری انجام می‌دهد و **کجا / چه زمانی / چرا** باید از آن استفاده کنید. برای هر Skill توضیح هدف، کاربرد و موقعیت استفاده داده شده است.

قانون کلی موقع انتخاب Skill: اگر بیش از یک Skill مُهم به نظر می‌رسد، مناسب‌ترین را با ترکیب حداقلی انتخاب کن؛ طبق دستورالعمل‌ها هر Skill انتخاب‌شده را واقعاً بخوان و اجرا کن، کورکورانه از Skill برای اجرا استفاده نکن.

---

## دسته‌بندی‌ها

| دسته | شامل Skill ها |
|------|--------------|
| الف) پاک‌سازی و ساده‌سازی کد | deslop، anti-slop، simplify، refactor، refactoring-guru، refactoring، knip، configure-knip، optimize-javascript، ponytail (و زیرمجموعه‌هایش) |
| ب) بازبینی و کیفیت کد | code-review، code-review-and-quality، requesting-code-review، receiving-code-review، verify-loop، verification-before-completion، dogfood |
| ج) معماری و طراحی نرم‌افزار (بر پایه کتاب) | a-philosophy-of-software-design، clean-architecture، clean-code، code-complete، designing-data-intensive-applications، domain-driven-design، domain-driven-design-distilled، implementing-domain-driven-design، patterns-of-enterprise-application-architecture، the-pragmatic-programmer، release-it، working-effectively-with-legacy-code |
| د) کارایی (کد) | improve، improve-codebase-architecture، improve-code-quality، executing-plans، subagent-driven-development، codebase-design، codebase-memory |
| ه) React / Next.js | react-doctor، react-best-practices، react-view-transitions، composition-patterns |
| و) طراحی UI و فرانت‌اند | frontend-design، frontend-ui-engineering، web-artifacts-builder، web-design-guidelines، web-performance-auditor، rams، interface-review، better-* ، popular-web-designs، variant، break، explain-interface، blueprint-animation، scroll-craft |
| ز) استتیک و کیفیت بصری | soft-skill (high-end visual)، taste-skill، taste-skill-v1، stitch-skill، minimalist-skill، brutalist-skill، redesign-skill، output-skill، gpt-tasteskill |
| ح) تولید تصویر و اثر | imagegen-frontend-mobile، imagegen-frontend-web، image-to-code-skill، brandkit، claude-design، design-mobile-apps |
| ط) مهارت‌های توسعه‌ی workflow | brainstorming، writing-plans، writing-skills، break، variant، using-superpowers، dispatching-parallel-agents، finishing-a-development-branch، using-git-worktrees |
| ی) خاص-پلتفرم | sentry، embedded-systems، security-audit، learnings، find-skills، skill آشنایی |
| ک) رشد محصول/بازاریابی (زیرپوشه seo) | حدود ۴۰+ مهارت مارکتینگ و بخش رشد |
| ل) سه‌بعدی و انیمیشن | threejs-* |
| م) اپ موبایل | appllama-* |

---

## الف) پاک‌سازی و ساده‌سازی کد

### deslop
**چیست:** کدهای اضافی (اسلُپ) را که AI هنگام نوشتن کد تولید می‌کند از شاخه فعلی حذف می‌کند — کامنت‌های غیرضروری، بررسی‌های دفاعی مضاعف، castهای بی‌دلیل به `any` و سبک‌های ناسازگار.

**کی استفاده:** بعد از هر بار نوشتن کد، پیش از کنار رفتن (از آن استفاده می‌کنیم تا کد تمیز بماند).

### anti-slop (نصبنام `install-anti-slop`)
**چیست:** افزونه‌های Oxlint ضدّ اسلُپ را نصب، پیکربندی، به‌روزرسانی یا ارتقا می‌دهد؛ هم‌چنین برای مهاجرت بین نصب‌ها حفظ سفارشی‌سازی‌های محلی کاربرد دارد.

**کی استفاده:** هنگام افزودن anti-slop، گرفتن قوانین/فیکس‌های بالادستی یا مهاجرت یک نصب موجود. برای اجرای خود lint نیست — خودش فریزپ است.

### simplify
**چیست:** کدهای اخیراً تغییرکرده را برای وضوح و ثبات ساده می‌کند، بدون تغییر رفتار. برعکس deslop که از شاخه کامل، یک نسخه ادیت برمی‌دارد.

**کی استفاده:** بلافاصله بعد از نوشتن کد، برای بهبود خوانایی. (هم‌خانواده evaluate-loop است ولی سبک‌تر.)

### refactor
**چیست:** بازسازی جراحی و تدریجی کد برای بهبود نگهداری‌پذیری بدون تغییر رفتار خارجی — شامل استخراج توابع، تغییر نام، شکستن god functionها، بهبود type safety و حذف code smellها.

**کی استفاده:** برای بهبود تدریجی کد موجود؛ گزینه‌ی ملایم‌تر از بازسازی کامل است.

### refactoring-guru
**چیست:** قوانین الهام‌گرفته از Refactoring.Guru برای تشخیص code smellها و انتخاب تکنیک مناسب بازسازی.

**کی استفاده:** هنگام تشخیص اینکه کد مشکل دارد و کدام روش refactoring بهتر است؛ همچنین جلوگیری از ادامه پاک‌سازی بیش از حد.

### refactoring (کتاب فاولر)
**چیست:** قوانین الهام‌گرفته از مارتین فاولر برای بهبود ساختار کد موجود در حالی که رفتار مشاهده‌شدنی حفظ می‌شود.

**کی استفاده:** مثل refactoring ولی مطابق اصول کتاب Refactoring — بهبود ساختار بدون تغییر رفتار.

### knip
**چیست:** ابزار knip را اجرا می‌کند تا فایل‌ها، وابستگی‌ها (dependencies) و exportهای بلااستفاده را پیدا و حذف کند.

**کی استفاده:** برای پاک‌سازی dead code و وابستگی‌های اضافی در پروژه‌های JS/TS.

### configure-knip
**چیست:** تنظیمات knip.json را راه‌اندازی و بهینه می‌کند تا خروجی knip دقیق و قابل‌اجرا باشد.

**کی استفاده:** وقتی می‌خواهید knip را در پروژه پیکربندی یا تنظیمات آن را بهبود ببخشید.

### optimize-javascript
**چیست:** الگوهای عملکرد V8/Node.js برای hot pathها، parserها و کتابخانه‌های اصلی در JS/TS — شامل حلقه‌های داغ، allocation سنگین، GC pressure و deoptimization.

**کی استفاده:** وقتی جاوااسکریپت کند است یا می‌خواهید سریع‌تر شود؛ محرک‌ها: «خیلی کند»، «سریع کن»، «بهینه کن»، «کجا bottleneck است».

### ponytail (و زیرمجموعه‌ها)
**چیست:** مجموعه‌ای که ساده‌ترین راه‌حلِ عملی را اعمال می‌کند — YAGNI، استاندارد لیبرری قبل از کد سفارشی، یک خط به جای پنجاه خط. سطح شدت: lite/full/ultra.

**کی استفاده:** روی هر کار کدنویسی (نوشتن، افزودن، refactor، فیکس، بازبینی) وقتی می‌خواهید از over-engineering جلوگیری کنید یا کاربر بگوید «لطفاً lazy/ساده». نه برای درخواست‌های غیرکدنویسی.

- **ponytail-audit** — ممیزی کل repo برای over-engineering: فهرست رتبه‌بندی‌شده از چیزهایی که حذف/ساده/جایگزین شود. یک‌بارِ گزارش است، چیزی را تغییر نمی‌دهد.
- **ponytail-review** — بازبینی پرهزینه‌محور فقط روی over-engineering در diff؛ نه درستیّ بلکه پیچیدگی.
- **ponytail-debt** — همه کامنت‌های `ponytail:` را به یک دفتر بدهی جمع می‌کند تا تعویق‌ها گم نشوند.
- **ponytail-gain** — تأثیرِ اندازه‌گیری‌شده پونی‌تیل را به‌صورت scoreboard (کمتر کد، هزینه کمتر، سرعت بیشتر) نشان می‌دهد. یک‌بارِ نمایش.
- **ponytail-help** — کارت مرجعِ سریع همه حالت‌ها/دستورهای ponytail. یک‌بارِ نمایش.

---

## ب) بازبینی و کیفیت کد

### code-review
**چیست:** بررسی تغییرات از یک نقطه ثابت (commit/branch/tag/merge-base) در دو محور: Standard (کد با استانداردهای مستند repo مطابقت دارد؟) و Spec (کد با ایسو/اسپک خواسته‌شده مطابقت دارد؟)؛ هر دو را به‌موازی در subagents اجرا و کنار هم گزارش می‌کند.

**کی استفاده:** کاربر بخواهد branch/PR/WIP را بازبینی کند یا بگوید «review since X». استدلال: مرحله‌های قبلی کیفیت را قبل از merge تضمین می‌کند.

### code-review-and-quality
**چیست:** بازبینی چندمحوره (درستی، خوانایی، معماری، امنیت، عملکرد) با top چند یافتهٔ تأییدشده.

**کی استفاده:** قبل از merge هر تغییری — چه کد خودتان، چه agent دیگر، چه انسان.

### requesting-code-review
**چیست:** مراحل درخواست بازبینی از یک reviewer؛ از تکمیل task تا قبل از merge برای راستی‌آزمایی که کار با نیازمندی‌ها مطابقت دارد.

**کی استفاده:** بعد از تکمیل feature بزرگ قبل از merge.

### receiving-code-review
**چیست:** نحوه دریافت بازبینی — قبل از پیاده‌سازی پیشنهادها، مخصوصاً وقتی مبهم یا از نظر فنی مشکوک است؛ نیازمند استحکام فنی و تأیید، نه تأیید نمایشی.

**کی استفاده:** وقتی بازبینی دریافت کرده‌اید و می‌خواهید درست به آن پاسخ دهید.

### verify-loop
**چیست:** حلقهٔ تأیید تغییرات اخیر — بعد از هر ادیت/batch ادیت، build/test/lint/trace را دوباره چک می‌کند، چیزهای memor-worthy را به ledger می‌رود و گزارش می‌دهد چه چیزی واقعاً verify شده و چه چیزی نه.

**کی استفاده:** بعد از هر ادیت و قبل از اعلام «تمام شد»؛ هم‌چنین هنگام تعویض task وسط کار. Global.

### verification-before-completion
**چیست:** قبل از ادعای کامل/فیکس‌شده/پاس بودن کار، دستورهای تأیید را اجرا و خروجی را تأیید کند.

**کی استفاده:** قبل از commit یا ایجاد PR — شواهد قبل از ادعا.

### dogfood
**چیست:** QA اکتشافی اپلیکیشن‌های وب — یافتن باگ‌ها، جمع‌آوری شواهد و گزارش.

**کی استفاده:** وقتی می‌خواهید کیفیت محصول را از دید کاربر نهایی بررسی کنید.

### review-prose
**چیست:** پیش‌نویس/ممیزی/بازنویسی prose فنی ماندگار برای فایل‌های repo یا خواننده‌های بیرونی — README، changelog، release note، توضیح PR/issue، کامنت بازبینی. حفظ حقایق، فشرده‌سازی و حذف لحن مکانیکی.

**کی استفاده:** وقتی متنی را برای repo می‌نویسید/ممیزی می‌کنید و مهم است صحیح و بدون قیش باشند. نه برای پاسخ معمولی یا کد. (تقریباً عکس humanizer است برای مستندات فنی.)

### humanizer
**چیست:** متن تولیدشده توسط AI را انسانی می‌کند — حذف AI-ism ها و افزودن صدا/لحن واقعی.

**کی استفاده:** برای محتوای مقابلمی (پست، ایمیل، کپی) که باید طبیعی و شبیه انسان خوانده شود.

---

## ج) معماری و طراحی نرم‌افزار (بر پایه کتاب)

> این دسته Skillهایی هستند که اصولِ کتاب‌های کلاسیک مهندسی نرم‌افزار را در کاربرد پیاده می‌کنند.

### a-philosophy-of-software-design
**چیست:** قوانین الهام‌گرفته از جان اوسترهاوت: کاهش پیچیدگی، طراحی مرز ماژول‌ها (deep modules) و بازبینی API/abstraction.

**کی استفاده:** هنگام کاهش پیچیدگی، طراحی مرز ماژول، یا بازبینی APIها و انتزاع‌ها.

### clean-architecture
**چیست:** قوانین کلین‌آرکیتکچر رابرت مارتین — جداسازی business policy از framework، DB، UI و infrastructure.

**کی استفاده:** هنگام جداسازی لایه‌ها، قانون وابستگی و مرزهای مستقل.

### clean-code
**چیست:** قوانین کلین کد رابرت مارتین — خوانایی، نام‌گذاری، طراحی تابع، مسئولیت‌ها و کد قابل آزمون.

**کی استفاده:** هنگام بهبود خوانایی و کیفیت کد روزمره.

### code-complete
**چیست:** قوانین ساخت از استیو مک‌کانل — اجرای routine، متغیرها، کلاس‌ها، کنترل‌جریان، کد دفاعی و تست.

**کی استفاده:** هنگام پیاده‌سازی روال‌ها، طراحی کلاس‌ها یا نوشتن تست.

### designing-data-intensive-applications
**چیست:** قوانین سیستمهای دادهمحور از مارتین کلپمن — قابلیت اطمینان، مقیاس‌پذیری، سازگاری، replication، تراکنش‌ها، جریان‌ها و migration شِما.

**کی استفاده:** هنگام طراحی بخش‌های دادهمحور: reliability، consistency، transactions، streams یا schema evolution.

### domain-driven-design
**چیست:** قوانین DDD اریک ایوانز — مدل‌سازی دامنهٔ پیچیده، bounded contexts، ubiquitous language و طراحی aggregate.

**کی استفاده:** هنگام مدل‌سازی دامنه پیچیده و تعریف مرزهای زمینه.

### domain-driven-design-distilled
**چیست:** نسخهٔ سبک DDD از وان ورنون — زیردامنه‌ها، context maps و مدل‌سازی تاکتیکی بدون تشریفات زائد.

**کی استفاده:** وقتی به DDD سبک و بدون مراسم اضافی نیاز دارید.

### implementing-domain-driven-design
**چیست:** پیاده‌سازی DDD از وان ورنون — aggregateها، domain events، repositoryها، application services و اتصال contextها.

**کی استفاده:** هنگام ساخت aggregate، رویداد دامنه، repository و سرویس‌های اپلیکیشن.

### patterns-of-enterprise-application-architecture
**چیست:** الگوهای مارتین فاولر برای اپلیکیشن‌های سازمانی — لایه‌ها، service layer، transaction script، domain model، repository، mapper و DTO.

**کی استفاده:** هنگام انتخاب لایه/معماری در سیستم‌های enterprise.

### the-pragmatic-programmer
**چیست:** اصول هانت و توماس — DRY، orthogonality، feedback loops، اتوماسیون و سازگاری.

**کی استفاده:** برای بهبود قضاوت مهندسی، حلقه بازخورد و طراحی ماژولار.

### release-it
**چیست:** اصول Production Reliability از مایکل نیگارد — مدیریت failure، timeout، retry، circuit breaker، observability و رفتار deploy.

**کی استفاده:** هنگام طراحی سیستم‌هایی که باید شکست‌ها را تاب بیاورند (production hardening).

### working-effectively-with-legacy-code
**چیست:** تکنیک‌های فِدِرس برای کد قدیمی/سخت‌آزمون — characterization tests، seams، sprout/wrap methods.

**کی استفاده:** وقتی باید کد بدون تست را به‌امن تغییر دهید.

---

## د) کارایی و بهبود کدبیس

### improve
**چیست:** به عنوان مشاور ارشد، کل کدبیس را بررسی و برنامه‌های اجرایی اولویت‌بندی‌شده و خودکفا برای مدل‌های دیگر تولید می‌کند؛ صرفاً‌-خواندنی، خودش چیزی تغییر نمی‌دهد. خروجی: باگ‌ها، امنیت، کارایی، پوشش تست، بدهی فنی، مهاجرت‌ها، مسیر روادمپ.

**کی استفاده:** وقتی از شما خواسته شود audit/بهبود کدبیس یا نقشه‌ی handoff برای agent دیگر.

### improve-codebase-architecture
**چیست:** کدبیس را اسکن می‌کند، فرصت‌های عمیق شدن (deepening) را پیدا، گزارش HTML بصری ارائه و سپس درباره انتخاب شما grill میکند.

**کی استفاده:** وقتی می‌خواهید عمق/مرز ماژول‌ها را بهتر کنید.

### improve-code-quality
**چیست:** سفر هدایت‌شده از پروتوتایپ بدون تست به محصول آماده‌ی production — تست، ساختار، مرز قوانین کسب‌وکار و مقاومت در مقیاس. ۹ مهارت را در فازها اجرا می‌کند و نتایج را در docs/ ثبت می‌کند.

**کی استفاده:** وقتی پروتوتایپ work می‌کند ولی می‌ترسید لمس‌ش کند — «on my machine works but I am scared to touch it». نه برای کدبیس قدیمی بزرگ (remove-technical-debt).

### executing-plans
**چیست:** اجرای یک plan پیاده‌سازی در سشن فعلی به عنوان پیاده‌ساز — وقتی کاربر اجرای inline را انتخاب کرده یا ابزار subagent در دسترس نیست.

**کی استفاده:** هنگام اجرای planها (بعد از writing-plans).

### subagent-driven-development
**چیست:** اجرای plan پیاده‌سازی با taskهای مستقل در جلسه فعلی با بهره‌گیری از subagents.

**کی استفاده:** وقتی plan taskهای موازی مستقل دارد که می‌توان delegated کرد.

### codebase-design
**چیست:** واژگان مشترک برای طراحی deep modules — رابط ماژول، فرصت‌های deepening، محل seam، قابلیت testable/AI-navigable.

**کی استفاده:** هنگام طراحی یا بهبود رابط ماژول، تصمیم محل seam یا testability.

### codebase-memory
**چیست:** گراف دانش کدبیس برای پرسش‌های ساختاری — درخت فراخوان‌ها، callers، dependencies، impact analysis، dead code، high fan-out، کاندیدای refactor.

**کی استفاده:** وقتی می‌خواهید بدانید چه تابعی چیست، چه کسی چه چیزی را می‌خواند یا impact یک تغییر چیست.

### improve-app / improve-business / improve-retention / improve-website
این چهار، «سفرهای هدایت‌شده» هستند که هر کدام یک وضعیت محصول/کسب‌وکار را مرحله‌به‌مرحله (با سؤال از کاربر در هر نقطه تصمیم و ثبت نتیجه در docs/) بهبود می‌دهند:

- **improve-app** — اپلیکیشنی که کار می‌کند ولی «rough» است → محصولی که به کار گرفته می‌شود، روان حرکت می‌کند و خوانا/متقاعدکننده است (۹ مهارت: jobs-to-be-done, ux-heuristics, refactoring-ui, microinteractions, made-to-stick…). Trigger: «این اپ درست کار می‌کند ولی حس خامی دارد».
- **improve-business** — کسب‌وکار راکد → تشخیص صادقانه، ریتم عملیاتی درست و offerهای قیمت‌گذاری درست (۸ مهارت استراتژی/EOS/negotiation…). Trigger: «درآمد صافه، نمی‌دانم چرا رشد متوقف شده».
- **improve-retention** — مشکل نگهداشت کاربر با دید Behavioral Design (B=MAP) — activation، onboarding friction، churn، aha moment.
- **improve-website** — وب‌سایت زنده با تبدیل پایین → backlog اولویت‌بندی‌شده از فیکس‌های تبدیل/قابل‌استفاده/پیام/سرعت که هر کدام به‌عنوان آزمایش قابل‌سنجش داده می‌شود. Trigger: «لندینگ کانورت نمی‌کند، بازطراحی هم جواب نداد».

تمایز: برای افزایش کد/بک‌اند improve-code-quality؛ برای سایت‌های مارکتینگ improve-website؛ برای محصول improve-app؛ برای بیزنس improve-business.

### landing-page-design
**چیست:** سیستم کامل برای ساخت لندینگ با تبدیل بالا — سؤال‌های intake، ساختار صفحه، انتخاب layout، CRO copywriting، سئو + قوانین بصری سخت (تایپوگرافی، spacing، radius، hero، icons، motion).

**کی استفاده:** هنگام ساخت/ویرایش/استایل/بازبینی/نوشتن کپیِ هر لندینگ پیج، سایت مارکتینگ یا سکشن/کامپوننت/پروتوتایپ — **حتی اگر کاربر به طراحی اشاره هم نکند**؛ قبل از انتخاب headline/CTA/font/spacing/conversion استفاده شود.

---

## ه) React / Next.js

### react-doctor
**چیست:** تشخیص و رفع مشکلات سلامت کدبیس React — امنیت، عملکرد، درستی و کیفیت کد.

**کی استفاده:** هنگام بازبینی کد React، رفع مشکلات عملکرد، ممیزی امنیت یا بهبود کیفیت.

### react-best-practices
**چیست:** راهنمای بهینه‌سازی عملکرد React و Next.js از تیم Vercel Engineering.

**کی استفاده:** هنگام نوشتن/بازبینی/refactor کد React یا Next — data fetching، bundle optimization و بهبود عملکرد.

### react-view-transitions
**چیست:** پیاده‌سازی transition های نرم و native-feeling با View Transition API — کامپوننت `<ViewTransition>`، `addTransitionType` و CSS pseudo-elementها؛ شامل transition صفحه، route، element مشترک، ورود/خروج و مرتب‌سازی لیست.

**کی استفاده:** هر جا انیمیشن بین state/page/رَیوت می‌خواهید بدون کتابخانه سوم.

### composition-patterns
**چیست:** الگوهای ترکیب React که مقیاس می‌گیرند — avoidance از boolean prop proliferation، compound components، render props، context providerها و React 19 API changes.

**کی استفاده:** هنگام refactor کامپوننت با پراپ‌های boolean زیاد، ساخت کتابخانه کامپوننت یا طراحی APIهای قابل استفاده مجدد.

---

## و) طراحی UI و فرانت‌اند

### frontend-design
**چیست:** راهنمای طراحی بصری متمایز و عمدی برای UI جدید یا بازطراحی UI موجود — جهت استتیک، تایپوگرافی و انتخاب‌هایی که شبیه قالب آماده نیستند.

**کی استفاده:** هنگام ساخت UI جدید یا تغییر شکل UI موجود برای هویت بصری خاص.

### frontend-ui-engineering
**چیست:** ساخت UI با کیفیت production — نه تنها رابط یعنی کامپوننت، layout، state management و احساس «حرفه‌ای» به جای «AI-ساخته».

**کی استفاده:** هنگام ساخت یا تغییر کامپوننت‌های کاربر-محور؛ به جای اینکه خروجی شبیه قالب آماده باشد.

### web-artifacts-builder
**چیست:** مجموعه ابزار برای ساخت artifactهای پیچیده و چندجزئی claude.ai با React، Tailwind CSS و shadcn/ui.

**کی استفاده:** برای artifactهای با state management یا routing؛ نه برای single-file ساده.

### web-design-guidelines
**چیست:** بازبینی کد UI بر اساس Web Interface Guidelines.

**کی استفاده:** وقتی از شما خواسته شود «review UI»، «check accessibility»، «audit design» یا «check against best practices».

### web-performance-auditor
**چیست:** تست و هل Core Web Vitals، بارگذاری، رندر و بهینه‌سازی شبکه.

**کی استفاده:** برای ممیزی عملکردِ وب و کشف anti-patternهای ساختاری؛ «this is slow» غالباً به آن ختم می‌شود.

### rams
**چیست:** اجرای بازبینی دسترس‌پذیری (WCAG) و طراحی بصری روی کامپوننت‌ها.

**کی استفاده:** هنگام بازبینی کد UI برای WCAG و مسائل طراحی.

### interface-review
**چیست:** بازبینی یک **تغییر** (نه یک screen) — scope را مشخص، فایل‌های تغییر‌کرده را به سطح‌هایی که تحت تأثیر قرار می‌دهد بسط و هر یافته را طبقه‌بندی می‌کند. دستتان را به better-interface می‌دهد.

**کی استفاده:** وقتی می‌پرسید «آیا این تغییر، بدتر کرد» — بررسی‌یِ تغییر نه کل codebase.

### better-* (family)
این خانواده گروهی از مهارت‌های تخصصی UI هستند که هر کدام یک بُعد را ارزیابی و بهبود می‌دهند:

- **better-accessibility** — انطباق با استانداردهای دسترس‌پذیری (WCAG).
- **better-colors** — ساخت سیستم رنگ، تولید پالت، semantic tokens، تبدیل فرمت‌ها و بررسی کنتراست.
- **better-layout** — گروه‌بندی، تراز، ترتیب خواندن، progressive disclosure و جزئیات layout.
- **better-typography** — نوع‌سنجی: scale و spacing، variable fonts، OpenType features، wrapping و truncation.
- **better-ui** — پولیش کلی UI: border radius، optical alignment، عمق سطح، icons و hit areas.
- **better-writing** — بهبود copy محصول و پیام در پروژه.
- **better-interface** — ترکیب همه better-* ها در یک بازبینی (accessibility, layout, writing, typography, color, UI polish).

**کی استفاده:** هر کدام در حوزه تخصصی‌اش هنگام ساخت/ویرایش UI؛ better-interface به عنوان بازبینی جامع.

### popular-web-designs
**چیست:** ۵۴ سیستم طراحی واقعی (Stripe, Linear, Vercel و…) به صورت HTML/CSS.

**کی استفاده:** برای الهام گرفتن یا استفاده مستقیم از دیزاین‌سیستم‌های واقعی در پروژه.

### variant
**چیست:** از یک توصیف UI، سه نسخه متفاوت (روی یک محور) می‌سازد و پشت یک picker در صفحه واقعی قرار می‌دهد تا کاربر انتخاب کند.

**کی استفاده:** وقتی می‌خواهید گزینه‌های جایگزین را ببینید و انتخاب کنید. (داوری نیست؛ تولید است.)

### break
**چیست:** یک کامپوننت را در هر state و سناریوی ممکن، روی صفحه موقت رندر و stress test می‌کند — خروجی گزارش بصری است از اینکه کجا شکست می‌خورد.

**کی استفاده:** برای تست مقاومت کامپوننت در برابر بدترین محتوا؛ مستقیم روی یک کامپوننت متمرکز.

### explain-interface
**چیست:** کشف میکند «چطور» چیزی ساخته شده — لایه‌کشیِ تکنولوژی، سیستم‌های طراحی و جلوه‌های گرافیکی. توضیح می‌دهد نه قضاوت.

**کی استفاده:** وقتی از شما می‌پرسند این سایت/المان چطور ساخته شده.

### blueprint-animation
**چیست:** انیمیشن blueprint که تصمیمات UX را قدم‌به‌قدم توضیح می‌دهد — Before/After، بازسازی ماژول‌های تغییرکرده و حاشیه‌نویسی برای case study.

**کی استفاده:** برای case study و پست‌های توضیحی درباره تغییر طراحی.

### scroll-craft
**چیست:** لندینگ‌پیج‌هایِ scroll-driven و درجه‌یک برای برندهای خدماتی/محصول/غذا — قهرمان‌های dimensional با هواپیماهای مستقل، motion محدود و کامپوزیشن موبایل جداگانه. خروجی: HTML سمنتیک و verify بصری.

**کی استفاده:** وقتی کاربر می‌گوید «scrollytelling»، «layered hero»، «premium hero»، «Apple-style landing page»، «سایتی که اسکرول ویدیو پخش کند».

### motion-design
**چیست:** اصول Motion Design — timing، easing، choreography و اصول انیمیشن دیزنی برای UI.

**کی استفاده:** هنگام ساخت هر نوع انیمیشن/transition/micro-interaction/loading state/scroll effect؛ قابل استفاده با CSS، Framer Motion، GSAP، Lottie، Spring.

### ascii-art
**چیست:** ساخت هنر ASCII با ابزارهایی چون pyfiglet, cowsay, boxes و تبدیل تصویر به ascii.

**کی استفاده:** برای بنر، متن‌های تزئینی ترمینال یا خروجی متنی.

### ascii-video
**چیست:** تبدیل ویدیو/صدا به انیمیشن‌های ASCII رنگی MP4/GIF.

**کی استفاده:** برای ساخت جلوه‌های بصری متنی و ویدیوهای سبک ترمینال.
---

## دیباگ و تست (Workflow تکمیلی)

### systematic-debugging
**چیست:** رویکرد سیستماتیک برای رفع هر bug/test failure/رفتار غیرمنتظره — قبل از پیشنهاد فیکس.

**کی استفاده:** هدف: یافتن ریشه مشکل از طریق تحقیق، نه حدس و پاک‌کاری.

### test-driven-development
**چیست:** TDD — قبل از نوشتن کد پیاده‌سازی، ابتدا تست (قرمز) نوشته می‌شود.

**کی استفاده:** قبل از نوشتن کد هر feature/bugfix، به‌عنوان روش پیش‌فرض.

### diagnosing-superpowers
**چیست:** وقتی یک جلسه ابرقدرت (superpowers) بد پیش رفت و شریک انسانی می‌خواهد بداند چرا — کار تکراری، نقشهٔ نادیده، خطا، «چرا این‌قدر طول کشید/گران شد» — تحلیل و ساخت bug report برای maintainerها.

**کی استفاده:** آن‌جا که خرابی/هزینه/تکرار در جلسه superpowers رخ داده و می‌خواهید root cause را برای گزارش به تیم superpowers مستند کنید.

---

## ز) استتیک و کیفیت بصری

### soft-skill (high-end-visual-design)
**چیست:** آموزش طراحی «آژانس سطح بالا» — تعریف دقیق fonts، spacing، shadows، کارت‌ها و animationهایی که سایت را گران نشان می‌دهد؛ بلوک کردن default های رایج که ارزان/عمومی می‌کنند.

**کی استفاده:** قبل از هر بازطراحی یا ساخت UI که باید هزینهٔ واقعی یک آژانس را تقلید کند.

### taste-skill (design-taste-frontend)
**چیست:** آنتی-اسلپ فرانت‌اند برای لندینگ/پورتفولیو/بازطراحی — خواندن بریف، استنتاج جهت طراحی و ساخت رابط‌هایی که قالب نیستند؛ audit-first روی redesignها و strict pre-flight check.

**کی استفاده:** هنگام هر طراحی فرانت‌اند که باید از قالب‌های آماده فاصله بگیرد.

### taste-skill-v1
**چیست:** نسخه و۱ از طراحی‌فرانت (design-taste-frontend v1) که حفظ شده تا رفتار دقیق نسخه اول برای پروژه‌های وابسته به آن فراهم باشد. پیش‌فرض فعلی v2 (experimental) است.

**کی استفاده:** فقط اگر به سازگاری دقیق با رفتار v1 نیاز دارید.

### stitch-skill
**چیست:** Design System برای Google Stitch — فایل‌های DESIGN.md تولید می‌کند که استانداردهای premium/anti-generic را اعمال می‌کنند.

**کی استفاده:** هنگام ساخت/استفاده از طراحی با Google Stitch.

### minimalist-skill
**چیست:** رابط‌های editorial و تمیز — پالت monocrome گرم، کنتراست تایپوگرافی، bento grids، بدون گرادیان و سایه سنگین.

**کی استفاده:** وقتی ظاهر مینیمال/ادیتوریال می‌خواهید.

### brutalist-skill
**چیست:** رابط‌های خام و مکانیکی — تایپوگرافی سوئیسی، استتیک نظامی، grid صلب و تخریب آنالوگ.

**کی استفاده:** برای داشبوردهای دادهمحور، پورتفولیو یا سایت‌های تحریری که باید مثل «blueprint طبقه‌بندی‌شده» حس شوند.

### redesign-skill
**چیست:** ارتقای وب‌سایت/اپ موجود به کیفیت premium — audit طراحی فعلی، شناسایی الگوهای AI و اعمال استانداردهای بالا بدون شکستن عملکرد.

**کی استفاده:** روی پروژه‌های موجود که می‌خواهید ظاهر گران را بدون ریسک بشکنید.

### output-skill (full-output-enforcement)
**چیست:** جلوگیری از truncation پیش‌فرض LLM؛ خروجی کامل اجباری و ممنوعیت placeholderها.

**کی استفاده:** برای هر taskی که خروجی کامل بدون کوتاه‌شدن می‌خواهد.

### gpt-tasteskill
**چیست:** مهندس UX/UI و GSAP Motion — random-سازی واقعی برای تنوع layout، ساختار AIDA، تایپوگرافی editorial وسیع، bento grids و ScrollTriggers.

**کی استفاده:** وقتی می‌خواهید لندینگ با موشن پیچیده و GSAP بسازید.

---

## ح) تولید تصویر و اثر

### imagegen-frontend-mobile
**چیست:** تولید تصویر برای کانسپت‌های اپ موبایل (iOS/Android/cross-platform) — سلسله‌مراتب تمیز، متن خوانا، پالت کنترل‌شده، mockup گوشی. **فقط تصویر تولید می‌کند، کد نمی‌نویسد.**

**کی استفاده:** هنگام ساخت کانسپت‌های صفحه موبایل یا flows.

### imagegen-frontend-web
**چیست:** تولید تصویر جهت‌دار برای رفرنس‌های طراحی وب — قانون بحرانی: **برای هر سکشن یک تصویر افقی جداگانه** (لندینگ با ۸ سکشن = ۸ تصویر). ترکیب‌بندی متنوع، پس‌زمینه آزاد، CTA متنوع.

**کی استفاده:** هنگام ساخت رفرنس‌های طراحی که توسعه‌دهنده‌ها بتوانند دقیقاً بازسازی کنند.

### image-to-code-skill
**چیست:** تبدیل تصویر به کد وبسایت باکیفیت — ابتدا تصویر طراحی را تولید/تحلیل می‌کند، سپس وب‌سایت را مطابق همان پیاده‌سازی می‌کند.

**کی استفاده:** برای وب‌سایت‌هایِ visually-important که تصویر حرف اول را می‌زند.

### brandkit
**چیست:** تولید تصویر برندکیت premium — boardهای brand-guideline، سیستم لوگو، identity deck و visual-world presentation، با تمرین برای ۱۰ نوع برند (minimalist، luxurious، dark-tech، gaming و…).

**کی استفاده:** هنگام ساخت سیستم برند/هویت بصری.

### claude-design
**چیست:** طراحی artifactهای HTML یکبارمصرف — لندینگ، اسلاید ارائه، پروتوتایپ.

**کی استفاده:** برای ساخت سریع پروتوتایپ‌های تک‌صفحه‌ای در claude.ai.

### design-mobile-apps
**چیست:** طراحی اپ موبایل یا UI screen — از جمله پروژه‌های Sleek (sleek.design) یا پیاده‌سازی در HTML, React Native, SwiftUI.

**کی استفاده:** وقتی کاربر می‌خواهد اپ موبایل یا screen طراحی کند.

---

## ط) مهارت‌های توسعه workflow

### brainstorming
**چیست:** قبل از هر کار خلاقانه، کشف می‌کند کاربر واقعاً چه می‌خواهد و چرا — ساخت feature، کامپوننت، افزودن قابلیت، تغییر رفتار یا برنامه‌ریزی هر چیز جدید. سؤال‌های خوب و فهم why.

**کی استفاده:** **الزاماً قبل از هر کار خلاقانه** — هر بار که قرار است چیزی بسازید یا اضافه کنید. (قبل از plan mode هم باید brainstorm شود.)

### writing-plans
**چیست:** قبل از لمس کد، از spec/نیازمندی‌ها، plan گام‌به‌گام می‌سازد.

**کی استفاده:** هر زمان spec/نیازمندی برای task چندمرحله‌ای دارید.

### writing-skills
**چیست:** ایجاد، ویرایش یا verify مهارت‌های جدید قبل از استفاده.

**کی استفاده:** هنگام ساختن/ادیت/تست یک skill جدید.

### reclaude
**چیست:** فایل‌های CLAUDE.md را بر اساس اصول progressive disclosure بازسازی/ترمیم می‌کند.

**کی استفاده:** وقتی CLAUDE.md خیلی طولانی یا نامنظم شده و می‌خواهید خلاصه شود و به‌صورت لایه‌ای (اول نکات مهم، بعد جزئیات) در بیاید.

### using-superpowers
**چیست:** پایه‌ی workflow ابرقدرت‌ها — قبل از هر پاسخ یا action، skillهای مرتبط را پیدا و فراخوانی می‌کند.

**کی استفاده:** ابتدای هر گفتگو (نه در subagent). قانون: اگر حتی ۱٪ احتمال می‌دهید مهارتی مرتبط باشد، باید از آن استفاده کنید.

### dispatching-parallel-agents
**چیست:** اجرای موازی کارهایی که ۲+ task مستقل دارند (بدون state اشتراکی/وابستگی ترتیبی).

**کی استفاده:** برای سرعت بخشیدن با fan-out؛ اگر وابستگی ترتیبی هست، استفاده نکنید.

### finishing-a-development-branch
**چیست:** بعد از اتمام پیاده‌سازی با تست‌های پاس، تصمیم‌گیری می‌کند چطور کار را ادغام کنند.

**کی استفاده:** وقتی کار تمام شده و تست‌ها پاس هستند و باید integrate کنید.

### using-git-worktrees
**چیست:** قبل از شروع کار feature ایزوله، workspace ایزوله را آماده می‌کند — native یا fallback git worktree.

**کی استفاده:** هنگام شروع feature مستقل یا قبل از اجرای planها.

### learnings
**چیست:** دفتر ثبت آموخته‌های بین‌پروژه‌ای — الگو، فیکس یا تصمیم معماری قابل استفاده مجدد را ثبت می‌کند تا پروژه‌های دیگر ببرند.

**کی استفاده:** وقتی چیز reusable حل کردید (مثل یک فلگ FFmpeg، throttle و…) یا ابتدای کار در پروژه جدید می‌خواهید ببینید چه الگوهایی اعمال می‌شود. Global — همه پروژه‌های شما.

### find-skills
**چیست:** کمک به کشف و نصب skillهای جدید — وقتی می‌خواهید بدانید «مهارتی برای X هست؟».

**کی استفاده:** به‌جای جستجوی دستی؛ برای پیدا کردن قابلیت محصول.

### learn (پوشه autoharness)
**چیست:** از جلسه یک lesson واقعی و قابل استفاده مجدد استخراج و در کتابخانه مهارت‌ها ثبت می‌کند — نه به صورت خودسرانه، بلکه از طریق زنجیره proposal استاندارد.

**کی استفاده:** وقتی کاربر می‌گوید «این جلسه را ذخیره کن» یا `/learn`.

---

## ی) خاص-پلتفرم و امنیت

### sentry
**چیست:** الگوهای پایش خطا و Tracing عملکرد Sentry برای اپلیکیشن‌های Next.js.

**کی استفاده:** هنگام یکپارچه‌سازی یا رفع issues در Sentry داخل پروژه Next.js.

### embedded-systems
**چیست:** توسعه فریمور برای میکروکنترلرها (STM32, ESP32, FreeRTOS, bare-metal)، RTOS و بهینه‌سازی مصرف انرژی — peripheral، interrupt handler، DMA و timing.

**کی استفاده:** هر کار embedded یا real-time.

### security-audit
**چیست:** راهنمای امنیتی و بازبینی آسیب‌پذیری برای کدبیس، API، سرویس‌ها، CLI، کتابخانه و daemonها.

**کی استفاده:** سؤال امنیتی، بازبینی متمرکز، تحقیق آسیب‌پذیری، pen test یا audit کامل.

### performance-optimization
**چیست:** بهینه‌سازی عملکرد اپلیکیشن در فرانت‌اند، بک‌اند، کوئری‌ها و دیتابیس — Core Web Vitals، N+1 و bottleneck.

**کی استفاده:** وقتی الزام عملکرد دارید یا Profiling گلوگاه نشان می‌دهد.

### project-audit
**چیست:** ممیزی سلامت پروژه و کیفیت مستندات.

**کی استفاده:** ارزیابی کلی وضعیت یک پروژه (کد + مستندات).

---

## ک) رشد محصول و بازاریابی (پوشه seo)

این خانواده Skillهای رشد/بازاریابی SaaS است؛ هر کدام یک حوزهٔ مشخص دارد و غالباً به skillهای دیگر ارجاع می‌دهد (مثلاً «برای پیاده‌سازی tracking ببین analytics»). خلاصه‌ی هر کدام:

### محصول-محور
- **product-marketing** — زمینه‌ی بازاریابی محصول (پوزیشن، ICP، مخاطب) را در `.agents/product-marketing.md` ثبت می‌کند تا مهارت‌های دیگر ارجاع دهند. **اولین قدم هر پروژه مارکتینگ جدید.**
- **marketing-plan** — پلان جامع ۱۳-بخشی مبتنی بر AARRR، سفارشی برای بودجه/تیم/مرحله و قفل با milestones تامین مالی؛ خروجی Notion-paste-ready. برای fCMO/professional plan.
- **marketing-ideas** — برای وقتی متوقف مانده‌اید ایده‌های بازاریابی/رشد برای SaaS ارائه می‌دهد (نقطه شروع وقتی نمی‌دانید بعدی چه باشد).
- **launch** — برنامه‌ریزی لانچ محصول/feature/نسخه (Product Hunt، GTM، waitlist، checklist).
- **pricing** — تصمیمات قیمت‌گذاری و بسته‌بندی (tiers، freemium، free trial، value metric، Van Westendorp).
- **paywalls** — به‌به‌بود لحظه‌های درون‌برنامه‌ایِ درخواست ارتقا (paywall، upgrade screen، trial expiry). متمایز از pricing که درباره قیمت‌گذاری عمومی است.
- **signup** — بهینه‌سازی ثبت‌نام/ساخت حساب (کاهش dropoff، trial activation).
- **onboarding** — بهینه‌سازی تجربه پس از ثبت‌نام: activation، first-run، aha moment، empty states.
- **churn-prevention** — کاهش churn: cancel flow، save offer، dunning (بازیابی پرداخت ناموفق)، win-back، exit survey.
- **referrals** — برنامه ارجاع/افیلیت/دهان‌به‌دهان.
- **community-marketing** — ساخت و رشد جامعه (Discord/Slack/forum) و community-led growth.
- **customer-research** — پژوهش مشتری (مصاحبه، VOX، JTBD، persona، mining از G2/Reddit).
- **prospecting** — یافتن/کیفی‌سازی لیست ICP برای outbound.
- **revops** — سیستم‌های اتصال مارکتینگ به فروش: lead scoring، MQL/SQL، pipeline، CRM automation.
- **sales-enablement** — کولترال فروش: pitch deck، one-pager، objection handling، demo script، playbook.
- **product-marketing** — (بالا)

### کانال‌های ارتباطی
- **emails** — سکوئنس ایمیل خودکار/دِرایپ/لایف‌سایکل (welcome، nurture، re-engagement، trigger-based).
- **cold-email** — ایمیل سرد B2B و follow-up برای بازاریابی مستقیم به لید (SDR).
- **sms** — کپین SMS/MMS برای welcome، abandoned cart، post-purchase، win-back و کمپین‌های transactional.
- **social** — ساخت/اسکچول محتوای اجتماعی، repurposing، short-form video و social listening.
- **public-relations** — رسانه=Earned media: press pitch، newsjacking، HARO، media kit، op-ed.
- **popups** — پاپ‌آپ/مودال/overlay برای conversion (exit intent، جمع‌آوری ایمیل، announcement banner).
- **co-marketing** — شراکت‌های Go-to-market: partner، joint campaign، integration marketing.

### تبلیغات
- **ads** — استراتژی کمپین پولی: Google Meta LinkedIn X؛ اتوماسیون میان‌بر PPC، ROAS، audience targeting، bidding.
- **ad-creative** — تولید/تکرار کریتیو تبلیغی (headline، primary text، RSA) — مکمل ads که استراتژی‌ست.
- **ab-testing** — طراحی/اجرای آزمون A/B و برنامه آزمایش رشد (آزمون‌سازی سیستماتیک).

### سئو و وب‌سایت
- **seo-audit** — ممیزی فنی/روشنِ سئو: «چرا رتبه ندارم»، Core Web Vitals، crawl error و indexing.
- **ai-seo** — بهینه‌سازی برای موتورهای جستجوی AI و LLM citation: AEO/GEO/LLMO، OKF، llms.txt، AI Overviews.
- **schema** — نشانه‌گذاری ساختاریافته/JSON-LD برای rich results در گوگل.
- **site-architecture** — نقشه سلسله‌مراتب صفحات، ناوبری، URL structure و internal linking. (نه XML sitemap.)
- **programmatic-seo** — تولید صفحات مبتنی بر template و داده در مقیاس ([keyword]+[city]، directory، comparison).
- **directory-submissions** — ثبت در دایرکتوری‌های استارتاپ/SaaS/AI برای backlink و domain rating.
- **content-strategy** — تصمیم درباره «چه محتوایی» بسازیم (topic cluster، editorial calendar).
- **copywriting** — نوشتن/بازنویسی کپی وب‌سایت برای صفحات (home، pricing، feature، hero، CTA).
- **copy-editing** — ویرایش/بازبینی کپی موجود یا refresh محتوای قدیمی.
- **competitor-profiling** — پروفایل ساختاریافته از رقبا برای یک فهرست URL.
- **competitors** — صفحات مقایسه/جایگزین برای SEO و فروش ([Product] vs [Product]، alternative).
- **free-tools** — ساخت ابزار رایگان برای جذب لید/لینک («engineering as marketing»).
- **lead-magnets** — ایجاد/توزیع محتوای gated برای ایمیل (ebook, checklist, template).
- **image** — تولید/ادیت/بهینه‌سازی تصاویر مارکتینگ (Flux, Midjourney, DALL-E و…).
- **video** — تولید/ادیت ویدیو با ابزارهای AI (Remotion, HeyGen, Veo, Sora و…) یا فریمورک‌های برنامه‌محور.
- **marketing-psychology** — کاربرد اصول روانشناسی و behavioral science در مارکتینگ.
- **analytics** — راه‌اندازی/بهبود/ممیزی ردیابی (GA4، GTM، events، UTM، attribution).

### تبدیل
- **cro** — بهینه‌سازی نرخ تبدیل صفحه/فرم (home، landing، pricing، lead form). وقتی «این صفحه کانورت نمی‌کند».

---

## ل) سه‌بعدی (THREE.js)

ده مهارت کوچک برای توسعه Three.js؛ هر کدام یک موضوع:

- **threejs-fundamentals** — راه‌اندازی صحنه، دوربین، renderer، سلسله‌مراتب Object3D و سیستم‌های مختصات.
- **threejs-geometry** — ساخت هندسه (built-in shapes، BufferGeometry، custom، instancing).
- **threejs-materials** — PBR و مواد، textures، shader materials، بهینه‌سازی.
- **threejs-lighting** — انواع نور، سایه، محیط IBL و بهینه‌سازی روشنایی.
- **threejs-shaders** — نوشتن shader سفارشی (GLSL، ShaderMaterial، uniforms).
- **threejs-textures** — textures، UV mapping، environment maps و تنظیمات.
- **threejs-loaders** — بارگذاری GLTF، texture، مدل و محیط HDR.
- **threejs-animation** — keyframe، skeletal، morph targets و animation mixing.
- **threejs-interaction** — raycasting، controls، ورودی موس/لمس و انتخاب شیء.
- **threejs-postprocessing** — EffectComposer، bloom، DOF و screen effects.

---

## م) اپ موبایل (Appllama)

- **appllama-app-design-skill** — ساخت اسکرین‌های موبایل native-feeling (Expo/React Native) با رعایت Apple HIG، semantic colors، Reanimated و ضد-اسلپ؛ workflow مطالعه اپ‌های واقعی اول. Trigger: «build a screen»، «make this better»، «design onboarding».
- **appllama-usage** — استفاده درست از MCP اپلاما (mcp.appllama.io) برای تحقیق اپ‌های پردرآمد، صفحات، flows و عناصر UI، سپس ساخت از روی آن. وقتی MCP وصل است و task موبایل است.

---

## ن) ویدیو (Remotion)

دوازده مهارت کوچک برای ساخت ویدیو با Remotion (فریمورک ویدیوی مبتنی بر React)؛ هر کدام یک مرحله از چرخه:

- **remotion-create** — ساخت یک ویدیوی جدید با Remotion (راه‌اندازی پروژه).
- **remotion-markup** — بهترین شیوه های محتوا/انیمیشن/افکت در markup.
- **remotion-best-practices** — روترِ اصلی تمام مهارت‌های Remotion (نقطه ورود).
- **remotion-render** — خروجی/رندر گرفتن نهایی ویدیو.
- **remotion-studio** — پیش‌نمایش ویدیو در استودیو.
- **remotion-captions** — رونویسی، نمایش و جابه‌جایی زیرنویس/کپشن.
- **remotion-interactivity** — ساختار markup برای تعامل (کلیک/ورودی).
- **remotion-multimedia** — کار با مدیا (Mediabunny) — عکس/صدا/ویدیو.
- **remotion-maps** — انیمیشن نقشه (Maps) در Remotion.
- **remotion-docs** — جستجو در مستندات Remotion.
- **remotion-upgrade** — ارتقای نسخه Remotion و پکیج‌های مرتبط.
- **remotion-saas** — ساخت اپلیکیشن کامل با Remotion (SAAS ویدئو).

**کی استفاده:** هر کاری درباره تولید ویدیو با Remotion — ساخت، تدوین، رندر، زیرنویس یا ارتقا.

---

## نکات تکمیلی (ترتیب صحیح استفاده از workflow فوق)

1. **brainstorming** (the what & the why) → 2. **writing-plans** (گام‌به‌گام) → 3. **using-git-worktrees** (ایزوله) → 4. **subagent-driven-development / executing-plans** (اجرا) → 5. **verification** (verify-loop / verification-before-completion / requesting-code-review) → 6. **code-review** (بازبینی) → 7. **finishing-a-development-branch** (ادغام).

قانون: قبل از هر چیز خلاقانه brainstorming، بعد از بازبینی verify-loop، قبل از ادعای تمام verification-before-completion و قبل از merge code-review انجام می‌شود.

---

## ابزارهای درون خودِ SKILLS-GUIDE

این فایل فقط یک راهنماست؛ برای تمییزِ دقیق‌ترِ رفتارها گاهی به خود SKILLها مراجعه کنید — هر پوشه یک SKILL.md و گاهی AGENTS.md دارد.

**پایان مهم:** آماده شده تا طراح از روی آن آگاه شود — اما به یاد داشته باشید خود skill بهترین پاسخ را می‌دهد: این فقط پیش‌نمایش است.

---

## ⚡ جدول تصمیم‌گیری سریع

اگر مطمئن نیستید کدام Skill را استفاده کنید، این جدول را ببین (عاملی که برنامه را می‌خواند). هر ردیف = سناریو → skill:

| اگر می‌خواهید / می‌بینید | Skill مناسب |
|--------------------------|-------------|
| کد AI-nما نوشته شده و کامنت‌ها/دفاعی‌های اضافی دارد | deslop |
| جاوااسکریپت کند است | optimize-javascript، performance-optimization، web-performance-auditor |
| فایل/وابستگی/export بی‌استفاده | knip (و configure-knip برای تنظیمات) |
| کد بیش از حد پیچیده/over-engineered است | ponytail (یا ponytail-review / ponytail-audit) |
| ساختار کد بد است بدون تغییر رفتار | refactor، refactoring-guru، refactoring |
| قبل از merge بازبینی می‌خواهید | code-review، code-review-and-quality |
| می‌خواهید کد را تمیز/شکننده نشود | simplify، verify-loop، verification-before-completion |
| كد legacy بدون تست دارید | working-effectively-with-legacy-code |
| معماری بزرگ یا لایه‌ها | clean-architecture، clean-code، a-philosophy-of-software-design، the-pragmatic-programmer |
| سیستم دادهمحور / توزیع | designing-data-intensive-applications |
| مدل‌سازی دامنه پیچیده | domain-driven-design، domain-driven-design-distilled، implementing-domain-driven-design |
| سیستم‌های enterprise | patterns-of-enterprise-application-architecture |
| سیستم باید در production مقاوم باشد | release-it |
| سلامت React | react-doctor، react-best-practices |
| انیمیشن بین صفحات/state در React | react-view-transitions |
| طراحی کامپوننت‌های React با prop زیاد | composition-patterns |
| طراحی UI از صفر | frontend-design، frontend-ui-engineering، landing-page-design |
| بازبینی UI/WCAG | rams، web-design-guidelines، better-accessibility، interface-review، better-interface |
| ساخت سیستم رنگ | better-colors |
| بهبود copy محصول | better-writing، review-prose، humanizer، copywriting |
| طراحی لندینگ با تبدیل بالا | landing-page-design، gpt-tasteskill، scroll-craft، popular-web-designs |
| انتخاب بین چند ظاهر | variant |
| تست استرس یک کامپوننت | break |
| فهمیدن چطور چیزی ساخته شده | explain-interface |
| ساخت اپ موبایل | design-mobile-apps، appllama-app-design-skill، appllama-usage، imagegen-frontend-mobile |
| ساخت وب‌سایت با رفرنس تصویری | image-to-code-skill، imagegen-frontend-web |
| ساخت هویت برند | brandkit، claude-design |
| طراحی/بازطراحی premium | soft-skill، taste-skill، redesign-skill، brutalist-skill، minimalist-skill، stitch-skill |
| مشکل قراردادن در خروجی کامل | output-skill |
| قبل از کار خلاقانه | brainstorming |
| قبل از کدنویسی چندمرحله‌ای | writing-plans |
| اجرای plan | executing-plans، subagent-driven-development |
| کار موازی مستقل | dispatching-parallel-agents |
| ایزوله‌سازی feature | using-git-worktrees |
| بعد از اتمام کار | finishing-a-development-branch |
| نگهداشت/رشد محصول | improve-app، improve-retention، improve-business، improve-website، improve-code-quality |
| ممیزی سلامت پروژه | improve، project-audit، improve-codebase-architecture |
| پرس‌و‌جو درباره ساختار کدبیس | codebase-memory، codebase-design |
| سؤال React/NPM/بک‌اند خاص | react-best-practices، sentry (برای Error)، performance-optimization |
| کار embedded | embedded-systems |
| امنیت/آسیب‌پذیری | security-audit |
| سئو و رشد ارگانیک | seo/* |
| ثبت دانسته‌ها/آموزش | learnings، learn (autoharness) |

