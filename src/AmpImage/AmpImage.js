import React from 'react'
import PropTypes from 'prop-types'
import { getAlt, getSrc, getSrcSet, getInstances } from '../utils/utils'

const ampStyles = {
  image: {
    maxWidth: '100%'
  }
}

const AmpImage = (props) => {
  const fallbackImage = getSrc(props)
  const instances = getInstances(props)
  const { height, width } = instances[0] || { height: false, width: false }

  if (height && width) {
    return (
      <amp-img
        style={ampStyles.image}
        class={props.elementClass}
        src={fallbackImage.url}
        alt={getAlt(props)}
        srcSet={getSrcSet(props)}
        sizes={props.sizes}
        height={height}
        width={width}
        layout="responsive"
      />
    )
  }

  return (
    <amp-img
      style={ampStyles.image}
      class={props.elementClass}
      src={fallbackImage.url}
      alt={getAlt(props)}
      srcSet={getSrcSet(props)}
      height={props.fallbackHeight ? props.fallbackHeight : '225'}
      width={props.fallbackWidth ? props.fallbackWidth : '400'}
      sizes={props.sizes}
      layout="responsive"
    />
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

AmpImage.propTypes = {
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
  fallbackHeight: PropTypes.string,
  fallbackWidth: PropTypes.string,
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

AmpImage.defaultProps = {
  elementClass: ''
}

export default AmpImage
