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
  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const selections = [...wishList].join(', ') || 'No collection category selected yet';
    const subject = encodeURIComponent(`Rental availability: ${data.get('event')} on ${data.get('date')}`);
    const body = encodeURIComponent(
      `Hello Silly Goose Vintage Rentals,\n\n` +
      `My name is ${data.get('name')}. I’m planning a ${data.get('event')} on ${data.get('date')}.\n\n` +
      `Favorites: ${selections}\n` +
      `Event details: ${data.get('details') || 'I would love to learn more about availability.'}\n\n` +
      `Please reply to: ${data.get('email')}`
    );
    document.querySelector('#form-note').textContent = 'Opening your email app so you can choose the recipient and review your request.';
    document.querySelector('#form-note').classList.add('success');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
