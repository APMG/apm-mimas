import React from 'react'
import { render } from '@testing-library/react'
import Image from '../Image'
import { image, imageWithPreferred, gif } from '../../__testdata__/image'

const Gif = gif

function defaultProps() {
  const srcSet =
    'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/f65067-20220505-stanley-turrentine-400.jpg 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/53abde-20220505-stanley-turrentine-600.jpg 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/8a177d-20220505-stanley-turrentine-1000.jpg 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/c591a6-20220505-stanley-turrentine-1400.jpg 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/f1ded5-20220505-stanley-turrentine-2000.jpg 2000w'
  const src =
    'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/45eaad-20220505-stanley-turrentine-600.jpg'
  const alt = 'Some nice lawn chairs'
  const fallbackSrc =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_1400.jpg'
  const fallbackSrcSet =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_1400.jpg 1400w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_700.jpg 700w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_400.jpg 400w'

  return {
    src,
    srcSet,
    alt,
    fallbackSrc,
    fallbackSrcSet
  }
}

// SUCCESSES

test('creates the correct image when properly formatted image data is provided', () => {
  const expected = defaultProps()

  const { getByAltText, getByTestId } = render(<Image image={image} />)

  const picture = getByTestId('picture')
  const webp = getByTestId('webp')
  const jpg = getByTestId('notwebp')
  const img = getByAltText('Stanley Turrentine Short')

  expect(picture).toBeInTheDocument()
  expect(webp).toBeInTheDocument()
  expect(img).toBeInTheDocument()
  expect(jpg).toHaveAttribute(
    'srcSet',
    expect.stringContaining(expected.srcSet)
  )
  expect(img).toHaveAttribute('src', expect.stringContaining(expected.src))
})

test('creates the correct gif image when properly formatted image data is provided', () => {
  const expected = defaultProps()
  expected.srcSet =
    'https://img.apmcdn.org/dev/1c1a89e4b6dde0869d43947d7ba93a1cb1e35fe6/uncropped/451be5-20220506-scully-eye-roll-500.gif 500w'
  expected.src =
    'https://img.apmcdn.org/dev/1c1a89e4b6dde0869d43947d7ba93a1cb1e35fe6/uncropped/451be5-20220506-scully-eye-roll-500.gif'

  const { getByAltText, getByTestId } = render(<Image image={Gif} />)

  const picture = getByTestId('picture')
  const webp = getByTestId('webp')
  const gif = getByTestId('notwebp')
  const img = getByAltText('Scully Eye Roll')

  expect(picture).toBeInTheDocument()
  expect(webp).toBeInTheDocument()
  expect(gif).toBeInTheDocument()
  expect(img).toBeInTheDocument()
  expect(gif).toHaveAttribute(
    'srcSet',
    expect.stringContaining(expected.srcSet)
  )
  expect(img).toHaveAttribute('src', expect.stringContaining(expected.src))
})

test('does not output a webp source if there are not any webp instances', () => {
  Gif.aspect_ratios.uncropped.instances.shift()
  const expected = defaultProps()

  expected.srcSet =
    'https://img.apmcdn.org/dev/1c1a89e4b6dde0869d43947d7ba93a1cb1e35fe6/uncropped/451be5-20220506-scully-eye-roll-500.gif 500w'

  const { getByTestId } = render(<Image image={Gif} />)

  let webp
  const picture = getByTestId('picture')
  try {
    webp = getByTestId('webp')
  } catch (e) {
    return
  }

  const gif = getByTestId('notwebp')

  expect(picture).toBeInTheDocument()
  expect(webp).not.toBeInTheDocument()
  expect(gif).toBeInTheDocument()
  expect(gif).toHaveAttribute(
    'srcSet',
    expect.stringContaining(expected.srcSet)
  )
})

test('creates the correct image when data specifies which aspect ratio to use', () => {
  const expected = defaultProps()

  expected.srcSet =
    'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/c864f6-20220505-stanley-turrentine-400.jpg 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/45eaad-20220505-stanley-turrentine-600.jpg 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/163530-20220505-stanley-turrentine-1000.jpg 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/882eff-20220505-stanley-turrentine-1400.jpg 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/dcf171-20220505-stanley-turrentine-2000.jpg 2000w'
  expected.webpSrcSet =
    'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/1983c1-20220505-stanley-turrentine-webp400.webp 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/7e9c79-20220505-stanley-turrentine-webp600.webp 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/979ced-20220505-stanley-turrentine-webp1000.webp 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/d427ec-20220505-stanley-turrentine-webp1400.webp 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/6da01e-20220505-stanley-turrentine-webp2000.webp 2000w'

  const { getByAltText, getByTestId } = render(
    <Image image={imageWithPreferred} />
  )

  const img = getByAltText('Stanley Turrentine Short')
  const jpgsrc = getByTestId('notwebp')
  const webp = getByTestId('webp')

  expect(img).toBeInTheDocument()
  expect(jpgsrc).toHaveAttribute(
    'srcSet',
    expect.stringContaining(expected.srcSet)
  )
  expect(webp).toHaveAttribute(
    'srcSet',
    expect.stringContaining(expected.webpSrcSet)
  )
  expect(img).toHaveAttribute('src', expect.stringContaining(expected.src))
})

test('prioritizes the aspectRatio prop over the preferredAspectRatio in the data', () => {
  const expected = defaultProps()
  expected.srcSet =
    'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/square/1de86b-20220505-stanley-turrentine-400.jpg 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/square/ea14e9-20220505-stanley-turrentine-600.jpg 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/square/3fbe12-20220505-stanley-turrentine-1000.jpg 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/square/a93b24-20220505-stanley-turrentine-1400.jpg 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/square/462d74-20220505-stanley-turrentine-2000.jpg 2000w'

  const { getByAltText, getByTestId } = render(
    <Image image={imageWithPreferred} aspectRatio="square" />
  )

  const img = getByAltText('Stanley Turrentine Short')
  const jpgsrcset = getByTestId('notwebp')

  expect(img).toBeInTheDocument()
  expect(jpgsrcset).toHaveAttribute(
    'srcSet',
    expect.stringContaining(expected.srcSet)
  )
  expect(img).toHaveAttribute('src', expect.stringContaining(expected.src))
})

test('takes in a "sizes" string to specify image behavior based on viewport', () => {
  const expected = defaultProps()

  const { getByAltText, getByTestId } = render(
    <Image image={image} sizes="(min-width: 400px) 200px, 50vw" />
  )

  const img = getByAltText('Stanley Turrentine Short')
  const webp = getByTestId('webp')

  expect(img).toBeInTheDocument()

  expect(img).toHaveAttribute('src', expect.stringContaining(expected.src))
  expect(webp).toHaveAttribute(
    'sizes',
    expect.stringContaining('(min-width: 400px) 200px, 50vw')
  )
})

test('allows you to set the class with the elementClass property', () => {
  const { getByTestId } = render(
    <Image
      image={imageWithPreferred}
      elementClass="wazzap"
      aspectRatio="widescreen"
      sizes="(min-width: 960px) 720px, 100vw"
    />
  )

  const img = getByTestId('picture')

  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute('class', expect.stringContaining('wazzap'))
})

test('creates image when all fallbacks are provided', () => {
  const expected = defaultProps()
  const { getByAltText } = render(
    <Image
      fallbackSrc={expected.fallbackSrc}
      fallbackSrcSet={expected.fallbackSrcSet}
      alt={expected.alt}
    />
  )

  const img = getByAltText('Some nice lawn chairs')

  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute(
    'src',
    expect.stringContaining(expected.fallbackSrc)
  )
  expect(img).toHaveAttribute('alt', expect.stringContaining(expected.alt))
})

test('creates image based on data when all fallbacks are also provided', () => {
  const expected = defaultProps()

  const { getByAltText, getByTestId } = render(
    <Image
      image={image}
      fallbackSrc={expected.fallbackSrc}
      fallbackSrcSet={expected.fallbackSrcSet}
    />
  )

  const jpgsrc = getByTestId('notwebp')
  const img = getByAltText('Stanley Turrentine Short')

  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute('src', expect.stringContaining(expected.src))
  expect(jpgsrc).toHaveAttribute(
    'srcset',
    expect.stringContaining(expected.srcSet)
  )
})

// FAILURES

test('throws when provided poorly shaped image data', () => {
  let badData = {
    poop:
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_1400.jpg 1400w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_700.jpg 700w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_400.jpg 400w',
    alt: 4
  }

  let renderDidFail = false

  try {
    render(<Image image={badData} />)
  } catch {
    renderDidFail = true
  }

  expect(renderDidFail).toBeTruthy()
})

test('throws when when no props are provided', () => {
  let renderDidFail = false

  try {
    render(<Image />)
  } catch {
    renderDidFail = true
  }

  expect(renderDidFail).toBeTruthy()
})
