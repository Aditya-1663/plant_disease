 document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;

    function setActiveLink(links) {
      links.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || currentPath === '/' && linkPath.includes('home')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    const mainNavLinks = document.querySelectorAll('.main-nav a');
    setActiveLink(mainNavLinks);
   
  
    const mobileNavLinks = document.querySelectorAll('.mobile-menu nav a');
    setActiveLink(mobileNavLinks);
  });