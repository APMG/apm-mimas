import React from 'react'
import { render } from '@testing-library/react'
import AmpImage from '../AmpImage'
import { image, imageWithPreferred } from '../../__testdata__/image'

// This is basically a more limited selection of the same tests from Image, since the functionality is very similar, but the code is repeated, so they could change independently. I have added checks for those few AMP specific features, such as styles and needing a width and height.

function defaultProps() {
  const srcSet =
    'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/f65067-20220505-stanley-turrentine-400.jpg 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/53abde-20220505-stanley-turrentine-600.jpg 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/8a177d-20220505-stanley-turrentine-1000.jpg 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/c591a6-20220505-stanley-turrentine-1400.jpg 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/f1ded5-20220505-stanley-turrentine-2000.jpg 2000w'
  const src =
    'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/45eaad-20220505-stanley-turrentine-600.jpg'
  const sizes = '(min-width: 960px) 720px, 100vw'
  const className = 'test'
  const alt = 'Some nice lawn chairs'
  const fallbackSrc =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_1400.jpg'
  const fallbackSrcSet =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_1400.jpg 1400w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_700.jpg 700w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_400.jpg 400w'

  return {
    src,
    srcSet,
    sizes,
    class: className,
    alt,
    fallbackSrc,
    fallbackSrcSet
  }
}

// SUCCESSES

test('bug fix: has styles required to make amp-img not expand off the page', () => {
  const { container } = render(<AmpImage image={image} />)
  const img = container.firstChild

  expect(img).toHaveAttribute(
    'style',
    expect.stringContaining('max-width: 100%')
  )
})

test('provides width and height required by AMP based on instances', () => {
  const { container } = render(<AmpImage image={image} />)
  const img = container.firstChild

  expect(img).toHaveAttribute('width', expect.stringContaining('400'))
  expect(img).toHaveAttribute('height', expect.stringContaining('300'))
})

test('provides default width and height no matter what, as required by AMP', () => {
  const expected = defaultProps()
  const { container } = render(
    <AmpImage fallbackSrc={expected.fallbackSrc} alt={expected.alt} />
  )
  const img = container.firstChild

  expect(img).toHaveAttribute('width', expect.stringContaining('400'))
  expect(img).toHaveAttribute('height', expect.stringContaining('225'))
})

test('allows you to manually set width and height if there are no instances', () => {
  const expected = defaultProps()
  const { container } = render(
    <AmpImage
      fallbackSrc={expected.fallbackSrc}
      alt={expected.alt}
      fallbackWidth="900"
      fallbackHeight="500"
    />
  )
  const img = container.firstChild

  expect(img).toHaveAttribute('width', expect.stringContaining('900'))
  expect(img).toHaveAttribute('height', expect.stringContaining('500'))
})

test('creates the correct AMP image when properly formatted image data is provided', () => {
  const expected = defaultProps()

  const { container } = render(<AmpImage image={image} />)

  // getByAltText doesn't work for amp-img? Maybe I can do a PR! :eyes:
  const img = container.firstChild

  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute(
    'srcSet',
    expect.stringContaining(expected.srcSet)
  )
  expect(img).toHaveAttribute('src', expect.stringContaining(expected.src))
})

test('allows you to set the class with the elementClass property', () => {
  const expected = defaultProps()

  const { container } = render(
    <AmpImage
      image={imageWithPreferred}
      elementClass="test"
      aspectRatio="widescreen"
      sizes="(min-width: 960px) 720px, 100vw"
    />
  )

  const img = container.firstChild
  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute('src', expect.stringContaining(expected.src))
  expect(img).toHaveAttribute('class', expect.stringContaining(expected.class))
})

test('creates image when all fallbacks are provided', () => {
  const expected = defaultProps()

  const { container } = render(
    <AmpImage
      fallbackSrc={expected.fallbackSrc}
      fallbackSrcSet={expected.fallbackSrcSet}
      alt={expected.alt}
    />
  )

  const img = container.firstChild
  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute(
    'src',
    expect.stringContaining(expected.fallbackSrc)
  )
  expect(img).toHaveAttribute(
    'srcSet',
    expect.stringContaining(expected.fallbackSrcSet)
  )
  expect(img).toHaveAttribute('alt', expect.stringContaining(expected.alt))
})

//// FAILURES

test('throws when provided poorly shaped image data', () => {
  let badData = {
    poop:
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_1400.jpg 1400w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_700.jpg 700w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_400.jpg 400w',
    alt: 4
  }

  let renderDidFail = false

  try {
    render(<AmpImage image={badData} />)
  } catch {
    renderDidFail = true
  }

  expect(renderDidFail).toBeTruthy()
})

test('throws when when no props are provided', () => {
  let renderDidFail = false

  try {
    render(<AmpImage />)
  } catch {
    renderDidFail = true
  }

  expect(renderDidFail).toBeTruthy()
})
