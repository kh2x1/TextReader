document.getElementById('imageInput').addEventListener('change', function (event) {
    const uploadSuccessMessage = document.getElementById('uploadSuccessMessage');
    if (event.target.files.length > 0) {
        const fileName = event.target.files[0].name;
        uploadSuccessMessage.innerText = `تم تحميل الملف بنجاح: ${fileName}`;
        uploadSuccessMessage.style.display = 'block';
    } else {
        uploadSuccessMessage.style.display = 'none';
    }
});

async function extractText() {
    const imageInput = document.getElementById('imageInput');
    const extractedTextElement = document.getElementById('extractedText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const languageSelect = document.getElementById('language');
    const uploadSuccessMessage = document.getElementById('uploadSuccessMessage');

    if (imageInput.files.length === 0) {
        alert('الرجاء تحميل صورة أولاً.');
        return;
    }

    const imageFile = imageInput.files[0];
    const imageUrl = URL.createObjectURL(imageFile);
    const selectedLanguage = languageSelect.value; // اللغة المختارة

    // إظهار Spinner
    loadingSpinner.style.display = 'block';
    extractedTextElement.innerText = ''; // مسح النص السابق

    // تهيئة Tesseract.js
    const worker = Tesseract.createWorker({
        logger: m => console.log(m) // لطباعة سجلات العملية
    });

    try {
        await worker.load();
        await worker.loadLanguage(selectedLanguage); // تحميل اللغة المختارة
        await worker.initialize(selectedLanguage); // تهيئة اللغة المختارة
        const { data: { text } } = await worker.recognize(imageUrl);
        extractedTextElement.innerText = text; // عرض النص المستخرج
    } catch (error) {
        console.error('حدث خطأ أثناء استخراج النص:', error);
        extractedTextElement.innerText = 'حدث خطأ أثناء استخراج النص.';
    } finally {
        await worker.terminate(); // إنهاء العملية
        loadingSpinner.style.display = 'none'; // إخفاء Spinner
    }
}