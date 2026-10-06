const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
const wishButtons = [...document.querySelectorAll('.add-button')];
const wishStatus = document.querySelector('#wish-status');
const wishList = new Set();

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    navigation.classList.toggle('open', !open);
  });

  navigation.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  });
}

wishButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    if (wishList.has(item)) {
      wishList.delete(item);
      button.classList.remove('added');
      button.textContent = 'Add to wish list';
    } else {
      wishList.add(item);
      button.classList.add('added');
      button.textContent = 'Added ♥';
    }
    wishStatus.textContent = wishList.size
      ? `${wishList.size} ${wishList.size === 1 ? 'favorite' : 'favorites'} saved for your request.`
      : 'Your wish list is empty.';
  });
});

const inquiryForm = document.querySelector('#inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = inquiryForm.querySelector('button[type="submit"]');
    const status = document.querySelector('#form-note');
    const favorites = document.querySelector('#inquiry-favorites');
    const originalText = button.textContent;
    const selections = [...wishList].join(', ') || 'No collection category selected yet';
    favorites.value = selections;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = 'Sending your availability request to Jehnna…';
    status.className = 'form-note full-width';

    try {
      const response = await fetch('https://formsubmit.co/ajax/rentthegoose@gmail.com', {
        method: 'POST',
        body: new FormData(inquiryForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Form delivery failed');

      inquiryForm.reset();
      wishList.clear();
      wishButtons.forEach((wishButton) => {
        wishButton.classList.remove('added');
        wishButton.textContent = 'Add to wish list';
      });
      if (wishStatus) wishStatus.textContent = 'Your wish list is empty.';
      favorites.value = 'No collection pieces selected yet';
      button.textContent = 'Request sent ♥';
      status.textContent = 'Thank you! Your availability request was sent directly to Jehnna.';
      status.className = 'form-note full-width success';
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText;
      status.textContent = 'We could not send that request. Please call 314-960-1488 or email rentthegoose@gmail.com.';
      status.className = 'form-note full-width error';
    }
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const contactPageForm = document.querySelector('#contact-page-form');
if (contactPageForm) {
  contactPageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = contactPageForm.querySelector('button[type="submit"]');
    const status = document.querySelector('#contact-form-status');
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = 'Sending your message to Jehnna…';
    status.className = 'contact-form-status full-width';

    try {
      const response = await fetch('https://formsubmit.co/ajax/rentthegoose@gmail.com', {
        method: 'POST',
        body: new FormData(contactPageForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Form delivery failed');

      contactPageForm.reset();
      button.textContent = 'Message sent ♥';
      status.textContent = 'Thank you! Your inquiry was sent directly to Jehnna.';
      status.className = 'contact-form-status full-width success';
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText;
      status.textContent = 'We could not send that message. Please call 314-960-1488 or email rentthegoose@gmail.com.';
      status.className = 'contact-form-status full-width error';
    }
  });
}
