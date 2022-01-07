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

	// Show message if there are no results
	const visibleProfiles = document.querySelectorAll('.profiles tbody > tr:not(.hide)')
	if (visibleProfiles.length === 0) {
		document.querySelector('.no-results').style.display = 'block'
	} else {
		document.querySelector('.no-results').style.display = 'none'
	}

	// Set other filters back to default
	verifiedFilter[0].checked = true
	avatarFilter[0].checked = true
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

		// Reset search and other filter (need to improve this to allow multiple filters at the same time)
		avatarFilter[0].checked = true
		search.value = ''
	})
})

// Filter list based on ENS avatar
const avatarFilter = document.querySelectorAll('input[name="avatar"]')
avatarFilter.forEach(avatarOption => {
	avatarOption.addEventListener('change', () => {
		profiles.forEach(profile => {
			if (avatarOption.value === 'yes') {
				// If the selected filter is 'yes', hide profiles that are not verified
				if (profile.getAttribute('data-avatar') === 'FALSE') {
					profile.classList.add('hide')
				} else {
					profile.classList.remove('hide')
				}
			} else if (avatarOption.value === 'no') {
				// If the selected filter is 'no', hide profiles that are verified
				if (profile.getAttribute('data-avatar') === 'TRUE') {
					profile.classList.add('hide')
				} else {
					profile.classList.remove('hide')
				}
			} else {
				// Show all profiles
				profile.classList.remove('hide')
			}
		})

		// Reset search and other filter (need to improve this to allow multiple filters at the same time)
		verifiedFilter[0].checked = true
		search.value = ''
	})
})
