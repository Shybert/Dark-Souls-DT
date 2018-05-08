/* eslint-env mocha */
/* eslint-disable no-undef */
import * as display from '../../display/display'
import * as chai from 'chai'
const assert = chai.assert

describe('display', async () => {
  describe('createList()', async () => {
    beforeEach(() => {
      const ul: HTMLElement = document.createElement('ul')
      ul.id = 'list'
      document.body.appendChild(ul)
    })
    afterEach(() => {
      document.body.innerHTML = ''
    })
    const listInfoArray: Array<display.listInfo> = [{text: '1', id: '1'}, {text: '2', id: '2'}, {text: '3', id: '3'}]

    it('Should clear the current list', async () => {
      // Append an element to see that it is cleared after running the function
      const div: HTMLElement = document.createElement('div')
      div.id = 'div'
      document.body.appendChild(document.createElement('div'))
      await display.displayList('list', listInfoArray, () => {})

      assert.isNull(document.getElementById('div'), 'The ul element was not correctly cleared')
    })
    it('Should append an li for each array entry', async () => {
      await display.displayList('list', listInfoArray, () => {})
      const listElement: HTMLElement = document.getElementById('list')

      // Check if the correct amount of elements were appended
      assert.equal(listElement.childElementCount, 3, 'The correct amount of li elements were not appended')
      // Check if each element is an li
      for (let i = 0; i < listElement.childElementCount; i += 1) {
        assert.equal(listElement.children[i].tagName, 'LI', 'The appended element was not an li')
      }
    })
    it('Should add the provided text to each li', async () => {
      await display.displayList('list', listInfoArray, () => {})
      const listElement = document.getElementById('list')

      for (let i = 0; i < listElement.childElementCount; i += 1) {
        assert.equal(listElement.children[i].innerHTML, listInfoArray[i].text, 'The provided text was not correctly added to each li')
      }
    })
    it('Should add the provided ID to each li', async () => {
      await display.displayList('list', listInfoArray, () => {})
      const listElement: HTMLElement = document.getElementById('list')

      for (let i = 0; i < listElement.childElementCount; i += 1) {
        assert.equal(listElement.children[i].id, listInfoArray[i].id, 'The provided ID was not correctly added to each li')
      }
    })
    it("Should add the provided function as a 'click' event listener")
  })

  describe('addLiInfo()', async () => {
    let text: string
    let id: string
    let exampleClass: string
    before(() => {
      text = 'text'
      id = 'id'
      exampleClass = 'class'
    })

    it('Should return an li element', async () => {
      // Get node name and convert it to lowercase since nodeName returns uppercase
      const actual: string = (await display.addLiInfo('')).nodeName.toLowerCase()
      const expected: string = 'li'

      // Convert node name to lowercase since nodeName returns uppercase
      assert.equal(actual, expected, 'The returned element was not an li element')
    })
    it('Should append the provided text to the li', async () => {
      const returnedLi: HTMLElement = await display.addLiInfo(text)

      assert.equal(returnedLi.innerHTML, text, 'The text in innerHTML did not equal the text provided to the function')
    })
    it('Should not add a class or an ID if they are not provided', async () => {
      const returnedLi: HTMLElement = await display.addLiInfo('')

      assert.isTrue(returnedLi.classList.length === 0, 'The returned li had a class when no class was provided')
      assert.isFalse(returnedLi.hasAttribute('id'), 'The returned li had an ID when no ID was provided')
    })
    it('Should add the provided class to the li', async () => {
      const returnedLi: HTMLElement = await display.addLiInfo('', {theClass: exampleClass})

      assert.isTrue(returnedLi.classList.contains(exampleClass), 'The returned li did not contain the provided class')
    })
    it('Should add the provided ID to the li', async () => {
      const returnedLi: HTMLElement = await display.addLiInfo('', {id: id})

      assert.equal(returnedLi.id, id, 'The returned li did not contain the provided ID')
    })
    it('Should add both an ID and a class if both are provided', async () => {
      const returnedLi: HTMLElement = await display.addLiInfo('', {id: id, theClass: exampleClass})

      assert.isTrue(returnedLi.classList.contains(exampleClass), 'The returned li did not have the provided class')
      assert.equal(returnedLi.id, id, 'The returned li did not have the provided ID')
    })
  })

  describe('hidePages()', async () => {
    before(() => {
      // Set up div with ID set to 'content'
      const div: HTMLElement = document.createElement('div')
      div.id = 'content'
      document.getElementsByTagName('body')[0].appendChild(div)
    })

    it("Should set display to 'none' for all child nodes of the div with the ID 'content'", async () => {
      // Set up child nodes on the div with ID 'content
      const divContent: HTMLElement = document.getElementById('content')
      for (let i = 0; i < 3; i += 1) {
        divContent.appendChild(document.createElement('div'))
      }

      await display.hidePages()
      for (let i = 0; i < divContent.children.length; i += 1) {
        // Fail the test if display value has not been set to 'none'
        const actual: string = window.getComputedStyle((divContent.children)[i]).getPropertyValue('display')
        const expected: string = 'none'
        assert.equal(actual, expected, "Display value was not correctly set to 'none' for all three elements")
      }
    })

    after(() => {
      document.getElementsByTagName('body')[0].innerHTML = ''
    })
  })

  describe('formatTime()', () => {
    it('Should return a correctly formatted string', async () => {
      const actual: string = await display.formatTime(1000)
      const expected: string = '00:00:01.000'
      assert.equal(actual, expected, 'The returned string was not correctly formatted')
    })
    it('Should pad hours, minutes and seconds to two characters with leading zeros', async () => {
      const twoZeros: string = await display.formatTime(0)
      const oneZero: string = await display.formatTime(3661000)
      const message: string = 'Hours, minutes or seconds were not correctly padded to three characters'

      // Check if two zeros were added when there were no digits before
      assert.equal(twoZeros, '00:00:00.000', message)
      // Check if one zero was added there was one digit before
      assert.equal(oneZero, '01:01:01.000', message)
    })
    it('Should pad miliseconds to three characters with leading zeros', async () => {
      const threeZeros: string = await display.formatTime(0)
      const twoZeros: string = await display.formatTime(1)
      const oneZero: string = await display.formatTime(10)
      const message: string = 'Milliseconds were not correctly padded to three characters'

      // Check if three zeros were added when there were no digits before
      assert.equal(threeZeros, '00:00:00.000', message)
      // Check if two zeros were added when there was one digit before
      assert.equal(twoZeros, '00:00:00.001', message)
      // Check if one zero was added when there were two digits before
      assert.equal(oneZero, '00:00:00.010', message)
    })
    it('Should keep incrementing hours when time grows very large', async () => {
      const actual: string = await display.formatTime(8640000000000000)
      const expected: string = '2400000000:00:00.000'

      assert.equal(actual, expected, 'Hours did not get incremented correctly when time grew very large')
    })
    it('Should correctly format time', async () => {
      const message: string = 'Time was not correctly formatted'

      assert.equal(await display.formatTime(14123348), '03:55:23.348', message)
      assert.equal(await display.formatTime(3599999), '00:59:59.999', message)
      assert.equal(await display.formatTime(273600108), '76:00:00.108', message)
      assert.equal(await display.formatTime(3782004), '01:03:02.004', message)
      assert.equal(await display.formatTime(3596459987), '999:00:59.987', message)
    })
  })
})