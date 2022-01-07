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

// Filter list based on Twitter verification status
const verifiedFilter = document.querySelectorAll('input[name="verified"]')
verifiedFilter.forEach(verifiedOption => {
	verifiedOption.addEventListener('change', () => {
		profiles.forEach(profile => {
			if (verifiedOption.value === 'yes') {
				// If the selected filter is 'yes', hide profiles that are not verified
				if (profile.getAttribute('data-verified') === 'FALSE') {
					profile.classList.add('hide')
				} else {
					profile.classList.remove('hide')
				}
			} else if (verifiedOption.value === 'no') {
				// If the selected filter is 'no', hide profiles that are verified
				if (profile.getAttribute('data-verified') === 'TRUE') {
					profile.classList.add('hide')
				} else {
					profile.classList.remove('hide')
				}
			} else {
				// Show all profiles
				profile.classList.remove('hide')
			}
		})

		// Reset ENS avatar filter to unchecked (need to improve this to allow both at the same time)
		avatarFilter.checked = false
	})
})

// Filter list based on ENS avatar
const avatarFilter = document.querySelector('input[name="avatar"]')
avatarFilter.addEventListener('change', () => {
	profiles.forEach(profile => {
		if (avatarFilter.checked) {
			// If the filter is checked, hide profiles that do not have an ENS avatar
			if (profile.getAttribute('data-avatar') === 'FALSE') {
				profile.classList.add('hide')
			}
		} else {
			profile.classList.remove('hide')
		}
	})

	// Reset verified filter back to 'all' (need to improve this to allow both at the same time)
	verifiedFilter[0].checked = true
})
