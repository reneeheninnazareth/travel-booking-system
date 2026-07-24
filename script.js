const viewMoreBtn = document.getElementById('viewMoreCarsBtn');
const hiddenCars = document.querySelectorAll('.cars-card.hidden');

viewMoreBtn.addEventListener('click', () => {
  hiddenCars.forEach(car => car.classList.remove('hidden')); 
  viewMoreBtn.style.display = 'none'; 
});
