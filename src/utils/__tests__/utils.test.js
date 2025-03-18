import { getSrcSet, getInstances, getSrc, getAlt } from '../utils'
import {
  image,
  imageWithPreferred,
  imageWithPreferredNoFallback,
  imageNoFallback
} from '../../__testdata__/image'
let preferredExpected = {
  instances: [
    {
      height: 225,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/c864f6-20220505-stanley-turrentine-400.jpg',
      width: 400
    },
    {
      height: 225,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/1983c1-20220505-stanley-turrentine-webp400.webp',
      width: 400
    },
    {
      height: 337,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/45eaad-20220505-stanley-turrentine-600.jpg',
      width: 600
    },
    {
      height: 337,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/7e9c79-20220505-stanley-turrentine-webp600.webp',
      width: 600
    },
    {
      height: 562,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/163530-20220505-stanley-turrentine-1000.jpg',
      width: 1000
    },
    {
      height: 562,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/979ced-20220505-stanley-turrentine-webp1000.webp',
      width: 1000
    },
    {
      height: 786,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/882eff-20220505-stanley-turrentine-1400.jpg',
      width: 1400
    },
    {
      height: 786,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/d427ec-20220505-stanley-turrentine-webp1400.webp',
      width: 1400
    },
    {
      height: 1124,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/dcf171-20220505-stanley-turrentine-2000.jpg',
      width: 2000
    },
    {
      height: 1124,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/6da01e-20220505-stanley-turrentine-webp2000.webp',
      width: 2000
    }
  ]
}
// test getSrcSet
describe('getSrcSet', () => {
  test('returns null if no image object or fallbackSrcSet is provided', () => {
    let expected = null
    let output = getSrcSet()

    expect(output).toBe(expected)
  })

  test('returns fallbackSrcSet if no valid srcset can be derived from the image object', () => {
    const expected =
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_1400.jpg 1400w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_700.jpg 700w, https://s3-us-west-2.amazonaws.com/s.cdpn.io/298/wolf_20131015_003_400.jpg 400w'
    let imageData = { whatever: 'info' }
    let props = { image: imageData, fallbackSrcSet: expected }
    let output = getSrcSet(props)

    expect(output).toBe(expected)
  })

  test("returns the image object's srcset if no aspect ratio is preferred by the image data or the props", () => {
    let expected =
      'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/f65067-20220505-stanley-turrentine-400.jpg 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/53abde-20220505-stanley-turrentine-600.jpg 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/8a177d-20220505-stanley-turrentine-1000.jpg 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/c591a6-20220505-stanley-turrentine-1400.jpg 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/f1ded5-20220505-stanley-turrentine-2000.jpg 2000w'
    let props = { image, fallbackSrcSet: expected }
    let output = getSrcSet(props)

    expect(output).toBe(expected)
  })

  test("returns the image object's srcset with webp images if no aspect ratio is preferred by the image data or the props", () => {
    let expected =
      'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/1cbcf7-20220505-stanley-turrentine-webp400.webp 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/004144-20220505-stanley-turrentine-webp600.webp 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/164584-20220505-stanley-turrentine-webp1000.webp 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/dd6aec-20220505-stanley-turrentine-webp1400.webp 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/uncropped/5fb4a2-20220505-stanley-turrentine-webp2000.webp 2000w'
    let props = { image, fallbackSrcSet: expected }
    let output = getSrcSet(props, /webp$/)

    expect(output).toBe(expected)
  })

  test('generates the correct srcset if there is a preferred aspect ratio in the image data', () => {
    const expected =
      'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/c864f6-20220505-stanley-turrentine-400.jpg 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/45eaad-20220505-stanley-turrentine-600.jpg 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/163530-20220505-stanley-turrentine-1000.jpg 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/882eff-20220505-stanley-turrentine-1400.jpg 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/dcf171-20220505-stanley-turrentine-2000.jpg 2000w'
    imageWithPreferred.preferredAspectRatio = {}
    imageWithPreferred.preferredAspectRatio.instances =
      imageWithPreferred.aspect_ratios['widescreen'].instances

    imageWithPreferred.preferredAspectRatio.slug = 'widescreen'
    delete imageWithPreferred.aspect_ratios

    let props = {
      image: imageWithPreferred
    }
    let output = getSrcSet(props)

    expect(output).toBe(expected)
  })

  test('prioritizes the aspectRatio prop if there is a preferred aspect ratio in the image data', () => {
    let expected =
      'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/c864f6-20220505-stanley-turrentine-400.jpg 400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/45eaad-20220505-stanley-turrentine-600.jpg 600w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/163530-20220505-stanley-turrentine-1000.jpg 1000w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/882eff-20220505-stanley-turrentine-1400.jpg 1400w,https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/dcf171-20220505-stanley-turrentine-2000.jpg 2000w'
    let props = { image: imageWithPreferred, aspectRatio: 'square' }
    let output = getSrcSet(props)

    expect(output).toBe(expected)
  })
})

// test getInstances
describe('getInstances', () => {
  test('returns empty array if no instances can be found on the image object', () => {
    let expected = []
    let output = getInstances()

    expect(output).toMatchObject(expected)
  })

  test('returns the instances for the preferred aspect ratio if it can be found in the image data', () => {
    let expected = [
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/c864f6-20220505-stanley-turrentine-400.jpg',
        width: 400,
        height: 225
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/1983c1-20220505-stanley-turrentine-webp400.webp',
        width: 400,
        height: 225
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/45eaad-20220505-stanley-turrentine-600.jpg',
        width: 600,
        height: 337
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/7e9c79-20220505-stanley-turrentine-webp600.webp',
        width: 600,
        height: 337
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/163530-20220505-stanley-turrentine-1000.jpg',
        width: 1000,
        height: 562
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/979ced-20220505-stanley-turrentine-webp1000.webp',
        width: 1000,
        height: 562
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/882eff-20220505-stanley-turrentine-1400.jpg',
        width: 1400,
        height: 786
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/d427ec-20220505-stanley-turrentine-webp1400.webp',
        width: 1400,
        height: 786
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/dcf171-20220505-stanley-turrentine-2000.jpg',
        width: 2000,
        height: 1124
      },
      {
        url:
          'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/widescreen/6da01e-20220505-stanley-turrentine-webp2000.webp',
        width: 2000,
        height: 1124
      }
    ]

    let output = getInstances({
      image: imageWithPreferred,
      aspectRatio: 'widescreen'
    })

    expect(output).toMatchObject(expected)
  })

  test('returns the instances for a different aspect ratio if another is requested', () => {
    let output = getInstances({
      image: imageWithPreferred,
      aspectRatio: 'widescreen'
    })

    expect(output).toEqual(preferredExpected.instances)
  })
})

// test getSrc
describe('getSrc', () => {
  test('returns image.fallback if available', () => {
    let output = getSrc({
      image: {
        fallback:
          'https://img.apmcdn.org/c2c452354fbff94d720ba8f86e2c71ba7427b306/uncropped/f5db37-20181220-serena-brook-opens-our-show-at-the-town-hall.jpg',
        fallbackSrc: 'https://www.fillmurray.com/200/300'
      }
    })

    expect(output).toEqual({
      url:
        'https://img.apmcdn.org/c2c452354fbff94d720ba8f86e2c71ba7427b306/uncropped/f5db37-20181220-serena-brook-opens-our-show-at-the-town-hall.jpg'
    })
  })

  test('returns fallbackSrc image.fallback is not available', () => {
    let output = getSrc({ fallbackSrc: 'https://www.fillmurray.com/200/300' })
    expect(output).toEqual({ url: 'https://www.fillmurray.com/200/300' })
  })

  test('returns an instance of the preferred aspect ratio if no fallback or fallbackSrc', () => {
    let output = getSrc({
      image: imageWithPreferredNoFallback
    })
    expect(output).toEqual({
      height: 500,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/portrait/dfea86-20220505-stanley-turrentine-400.jpg',
      width: 400
    })
  })

  test('returns the first instance of the first available aspect ratio if no fallback, no fallbackSrc, and no preferred aspect ratio', () => {
    let output = getSrc({
      image: imageNoFallback
    })
    expect(output).toEqual({
      height: 301,
      url:
        'https://img.apmcdn.org/dev/93c76a3c3b11eaba504505deb939109ec8506b60/normal/d2a680-20220505-stanley-turrentine-400.jpg',
      width: 400
    })
  })
})

// test getAlt
describe('getAlt', () => {
  test('returns an empty string if no `alt` can be found on the image data or in the props', () => {
    let output = getAlt()
    expect(output).toMatchObject([])
  })

  test("returns the short caption on the image if that's available and the `alt` prop is not", () => {
    let output = getAlt({ image })
    expect(output).toBe('Stanley Turrentine Short')
  })

  test('favors the alt provided in the props if available', () => {
    let output = getAlt({ image, alt: 'i am an alt' })
    expect(output).toBe('i am an alt')
  })
})
