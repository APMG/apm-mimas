import React from 'react'
import PropTypes from 'prop-types'
import {
  getAlt,
  getSrc,
  getSrcSet,
  hasWebp,
  getSpecificInstance
} from '../utils/utils'

// Ideally, this component will take in an image object formatted by our images API and spit out an image with a proper srcset. However, I also thought I should provide a couple of fallback options, in case you want to use an image from somewhere else entirely: fallbackSrcSet and fallbackSrc. The last one will just create a normal img tag, so I really don't recommend it.

function ext(url) {
  if (typeof url != 'string') return ''
  let extension
  // Remove everything to the last slash in URL
  extension = url.substr(1 + url.lastIndexOf('.'))

  // Break URL at ? and take first part (file name, extension)
  extension = extension.split('?')[0]

  // Sometimes URL doesn't have ? but #, so we should aslo do the same for #
  extension = extension.split('#')[0]

  // Now we have only extension
  return extension
}

function SourceEle(props) {
  return <source {...props} />
}

const Image = (props) => {
  const fallbackImage = getSrc(props)
  const extension = ext(fallbackImage.url)
  const haswebp = hasWebp(props)
  const regexes = {
    jpg: /jpe?g\??(s=[0-9]+)?$/,
    jpeg: /jpe?g\??(s=[0-9]+)?$/,
    webp: /webp\??(s=[0-9]+)?$/,
    gif: /gif\??(s=[0-9]+)?$/,
    png: /png\??(s=[0-9]+)?$/
  }

  const fallbackImageProps = {
    src: fallbackImage.url,
    loading: props.loading
  }

  if (fallbackImage.width) fallbackImageProps.width = fallbackImage.width
  if (fallbackImage.height) fallbackImageProps.height = fallbackImage.height

  // We need a <source> element for each props.media for webp  and the same for non webp
  // So if there are 2 items in props.media and we have webp image there will be 3 <source> elements

  if (props.media) {
    return (
      <picture className={props.elementClass} data-testid="picture">
        {hasWebp &&
          props.media.map((med, idx) =>
            SourceEle({
              type: 'image/webp',
              key: `webp-${idx}`,
              srcSet:
                idx == 0
                  ? getSpecificInstance(props, props.mobileAr, regexes.webp) // only get the mobile art directed aspect ratio on the first media array item
                  : getSrcSet(props, regexes.webp),
              sizes: props.sizes,
              'data-testid': 'webp',
              media: `(${med})`
            })
          )}
        {props.media.map((med, idx) =>
          SourceEle({
            type: `image/${extension}`.replace(/jpg$/, 'jpeg'),
            key: `nonwebp-${idx}`,
            srcSet:
              idx == 0
                ? getSpecificInstance(props, props.mobileAr, regexes[extension])
                : getSrcSet(props, regexes[extension]),
            sizes: props.sizes,
            'data-testid': 'notwebp',
            media: `(${med})`
          })
        )}
        <img {...fallbackImageProps} alt={getAlt(props)} />
      </picture>
    )
  }

  return (
    <picture className={props.elementClass} data-testid="picture">
      {haswebp && (
        <SourceEle
          type="image/webp"
          srcSet={getSrcSet(props, regexes.webp)}
          sizes={props.sizes}
          data-testid="webp"
        />
      )}
      <SourceEle
        type={`image/${extension}`.replace(/jpg$/, 'jpeg')}
        srcSet={getSrcSet(props, regexes[extension])}
        sizes={props.sizes}
        data-testid="notwebp"
      />
      <img {...fallbackImageProps} alt={getAlt(props)} />
    </picture>
  )
}

const aspectRatioType = PropTypes.shape({
  instances: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number
    })
  ),
  slug: PropTypes.string
})

Image.propTypes = {
  image: PropTypes.shape({
    preferredAspectRatio: aspectRatioType,
    aspect_ratios: PropTypes.shape({
      normal: aspectRatioType,
      square: aspectRatioType,
      thumbnail: aspectRatioType,
      widescreen: aspectRatioType,
      portrait: aspectRatioType,
      uncropped: aspectRatioType
    }),
    fallback: PropTypes.string.isRequired,
    long_caption: PropTypes.string,
    short_caption: PropTypes.string,
    width: PropTypes.string,
    preferred_aspect_ratio_slug: PropTypes.string,
    id: PropTypes.string,
    url: PropTypes.string,
    srcset: PropTypes.string
  }),
  aspectRatio: PropTypes.oneOf([
    'normal',
    'square',
    'thumbnail',
    'widescreen',
    'portrait',
    'uncropped'
  ]),
  elementClass: PropTypes.string,
  fallbackSrcSet: PropTypes.string,
  fallbackSrc: PropTypes.string,
  alt: PropTypes.string,
  sizes: PropTypes.string,
  loading: PropTypes.string,
  media: PropTypes.array,
  mobileAr: PropTypes.string,
  mustProvideOne: function(props) {
    if (!props['image'] && !props['fallbackSrc']) {
      return new Error(
        'Please provide either a properly formatted image JSON object or an image src'
      )
    }
  },
  mustProvideAlt: function(props) {
    if (!props['image'] && !props['alt'] && props['alt'] !== '') {
      return new Error(
        'Please provide either a properly formatted image JSON object or an image alt'
      )
    }
  },
  mustProvideSrcWithSrcset: function(props) {
    if (!props['image'] && !props['fallbackSrc'] && props['fallbackSrcSet']) {
      return new Error(
        'You cannot provide a fallbackSrcSet without providing a fallbackSrc'
      )
    }
  }
}

Image.defaultProps = {
  elementClass: ''
}

export default Image
