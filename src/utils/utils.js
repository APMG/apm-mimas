const determineAspectRatio = (props) => {
  if (props.aspectRatio) {
    return props.aspectRatio
  } else if (props.image.preferredAspectRatio) {
    return false
  } else if (props.image && props.image.preferred_aspect_ratio_slug) {
    return props.image.preferred_aspect_ratio_slug
  } else {
    return 'uncropped'
  }
}

const generateSrcSet = (instances, typeRegex = /jpe?g$/) => {
  let rightones = instances.map((inst) =>
    typeRegex.test(inst.url) ? inst : null
  )

  return rightones
    .filter(Boolean)
    .map((instance) => `${instance.url} ${instance.width}w`)
    .join(',')
}

export const getSrcSet = (props, typeRegex = /jpe?g$/) => {
  if (!props) return null

  let { image, aspectRatio, fallbackSrcSet } = props

  if (!image) return fallbackSrcSet || null

  if (
    image.aspect_ratios &&
    determineAspectRatio(props) in image.aspect_ratios &&
    image.aspect_ratios[aspectRatio] !== null
  ) {
    return generateSrcSet(
      image.aspect_ratios[determineAspectRatio(props)].instances,
      typeRegex
    )
  } else if (image.preferredAspectRatio) {
    return generateSrcSet(image.preferredAspectRatio.instances, typeRegex)
  }

  if (image.srcset) {
    return image.srcset
  } else if (fallbackSrcSet) {
    return fallbackSrcSet
  }
}

export const getInstances = (props) => {
  if (!props) return []

  let { image, aspectRatio } = props

  if (image) {
    if (
      image.aspect_ratios &&
      determineAspectRatio(props) in image.aspect_ratios &&
      image.aspect_ratios[aspectRatio] !== null
    ) {
      return image.aspect_ratios[determineAspectRatio(props)].instances
    } else if (image.preferredAspectRatio) {
      return image.preferredAspectRatio.instances
    }
  }
  return []
}

export const getSrc = (props) => {
  if (!props) return []

  let { image, fallbackSrc } = props

  if (image && image.fallback) {
    return image.fallback
  } else {
    return fallbackSrc
  }
}

export const getAlt = (props) => {
  if (!props) return []

  let { alt, image } = props

  if (alt) {
    return alt
  } else if (image && image.short_caption) {
    return image.short_caption
  } else {
    return ''
  }
}
