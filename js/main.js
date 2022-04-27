const $ = s => document.querySelector(s)
const createElement = element => document.createElement(element)
const createListElement = (title, value) => {
    let newP = createElement('p')
    newP.innerHTML = `<strong>${title}</strong>: ${value}`
    return newP
}


$('#userSubmit').addEventListener('click', findDnd)
$('#userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        findDnd()
    }
})



const section2 = $('#section2')

function findDnd() {
    section2.innerHTML = ''
    let userInput = $('#userInput').value
    if (userInput.trim().length > 0) {
        fetch(`https://www.dnd5eapi.co/api/spells/?name=${userInput}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // if query returns no results
            if (data.count===0) {
                let errorMessage = createElement('h3')
                errorMessage.innerText = 'This spell cannot be found... Sorry'
                section2.appendChild(errorMessage)
            }
            // query returns one result
            else if (data.count === 1) {
                getSpell(`https://www.dnd5eapi.co${data.results[0].url}`)
            }
            // query returns more than one results
            else if (data.count >= 2) {
                console.log('more than 1!')
                data.results.forEach(obj => {
                    console.log(obj.url)
                    let newBtn = createElement('input')
                    newBtn.type = 'button'
                    newBtn.value = obj.name
                    newBtn.className = 'spellButton'
                    section2.appendChild(newBtn)
                    newBtn.addEventListener('click', function() {
                        getSpell(`https://www.dnd5eapi.co${obj.url}`)
                    }, false)
                })
            }
        })
        .catch(err => console.log(err))
    }
    
}

function getSpell(url) {
    section2.innerHTML = ''
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // name
            let name = createElement('h2')
            name.innerText = `${data.name}`
            section2.append(name)
            // level and school
            let levelAndSchool = createElement('p')
            levelAndSchool.innerText = `Level ${data.level} - ${data.school.name}`
            section2.append(levelAndSchool)
            // description
            let desc = createElement('p')
            desc.innerHTML = `<strong>${data.desc}</strong>`
            section2.append(desc)

            // create a flexbox div for spellInfo and spellDamage
            let flexDiv = createElement('div')
            flexDiv.className = 'flexDiv'
            section2.appendChild(flexDiv)

            // create div for spellInfo
            let spellInfo = createElement('div')
            spellInfo.className = 'spellInfo'
            flexDiv.appendChild(spellInfo)
            // spell info title
            let spellInfoTitle = createElement('h3')
            spellInfoTitle.innerText = 'General Spell Info'
            spellInfo.appendChild(spellInfoTitle)
            // casting time
            spellInfo.appendChild(createListElement('Casting Time', data.casting_time))
            // range
            spellInfo.appendChild(createListElement('Range', data.range))
            // duration
            spellInfo.appendChild(createListElement('Duration', data.duration))
            // area of effect
            try {
                spellInfo.appendChild(createListElement('Area of Effect', `${data.area_of_effect.size} - ${data.area_of_effect.type}`))
            } catch {
                // pass
            }
            // DC
            try {
                spellInfo.appendChild(createListElement('DC', data.dc.dc_type.name))
            } catch {
                // pass
            }

            // create div for spellDamage
            let spellDamage = createElement('div')
            spellDamage.className = 'spellDamage'
            flexDiv.appendChild(spellDamage)
            // damage
            if (data.damage) {
                let damageTitle = createElement('h3')
                damageTitle.innerText = 'Damage'
                spellDamage.appendChild(damageTitle)
                // damage type
                spellDamage.appendChild(createListElement('Damage Type', data.damage.damage_type.name))
                // damage at different spell levels
                let damageLevelTitle = createElement('h4')
                damageLevelTitle.innerText = 'Damage at Spell Levels:'
                damageLevelTitle.style.marginBottom = '.5rem'
                spellDamage.appendChild(damageLevelTitle)
                let slotObject = data.damage.damage_at_slot_level
                for(prop in slotObject) {
                    spellDamage.appendChild(createListElement(prop, slotObject[prop]))
                }
            }
        })
}