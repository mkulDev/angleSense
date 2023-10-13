import '@testing-library/jest-dom'
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'
import Home from '../screens/Home'

describe('testing Home Screen', () => {
  it('render UI elements', () => {
    render(<Home />)
    const buttons = screen.getAllByRole('button')
    const image = screen.findByTestId('progresBar')
    expect(buttons.length).toBe(6)
    expect(image).toBeTruthy()
  })

  it('changes button color on press', () => {
    render(<Home />)
    const button = screen.getByText('Vertical')
    const styleBefore = button.props.style
    const colorStyleBefore = styleBefore.find((style) => style.color === '#fad43a')
    expect(colorStyleBefore).toBeTruthy()
    fireEvent.press(button)
    const styleBAfter = button.props.style
    const colorStyleAfter = styleBefore.find((style) => style.color === '#eee')
    expect(colorStyleAfter).toBeTruthy
  })

  it('Check if a modal is shown after the button click.', () => {
    render(<Home />)
    const customAngleButton = screen.getByText('Custom 180°')
    expect(customAngleButton).toBeTruthy()
    fireEvent.press(customAngleButton)
    const infoText = screen.getByText('Provide angle from 0° to 180°')
    expect(infoText).toBeTruthy()
  })

  it('changes state on input', () => {
    // if we provide 020 and accept, we should recive 20
    render(<Home />)
    const customAngleBtnBefore = screen.getByText('Custom 180°')
    fireEvent.press(customAngleBtnBefore)
    const input = screen.getByTestId('input')
    fireEvent.changeText(input, '020')
    expect(input.props.value).toBe('020')
    const acceptButton = screen.getByText('Accept')
    fireEvent.press(acceptButton)
    const customAngleBtnAfter = screen.getByText('Custom 20°')
    expect(customAngleBtnAfter).toBeTruthy()
    const styles = customAngleBtnAfter.props.style
    const colorStyle = styles.find((style) => style.color === '#000')
    expect(colorStyle).toBeDefined()
  })
})
