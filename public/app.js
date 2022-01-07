const search = document.getElementById('search')
const profiles = document.querySelectorAll('.profiles tbody > tr')

search.addEventListener('keyup', () => {
	profiles.forEach(profile => {
		const text = profile.textContent.toLowerCase()
		if (!text.includes(search.value.toLowerCase())) {
			profile.classList.add('hide')
		} else {
			profile.classList = ''
		}
	})

	// check if there are any profiles left
	const visibleProfiles = document.querySelectorAll('.profiles tbody > tr:not(.hide)')
	if (visibleProfiles.length === 0) {
		document.querySelector('.no-results').style.display = 'block'
	} else {
		document.querySelector('.no-results').style.display = 'none'
	}
})
