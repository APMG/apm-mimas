const determineAspectRatio = (props) => {
  if (props.aspectRatio) {
    return props.aspectRatio
  } else if (props.image.preferredAspectRatio) {
    return false
  } else if (props.image && props.image.preferred_aspect_ratio_slug) {
    return props.image.preferred_aspect_ratio_slug
  } else {
    // console.warn(
    //   "We did not find the aspect ratio asked for. We are sending back 'uncropped' so you will get the uncropped aspect ratio if you have that in your graphql query and if not the fallback image."
    // )
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

export const hasWebp = (props) => {
  const { image } = props
  const flat = []
  let ars

  if (!image) return false

  if (image.preferredAspectRatio) {
    image.preferredAspectRatio.instances.forEach((obj) => flat.push(obj.url))
  } else {
    ars = image.aspect_ratios
    delete ars['__typename']
    Object.keys(ars).forEach((ar) => {
      ars[ar]?.instances.forEach((img) => flat.push(img.url))
    })
  }
  return flat.some((url) => /webp$/.test(url))
}

export const getSpecificInstance = (
  props,
  aspectratio,
  typeRegex = /jpe?g$/
) => {
  let { image } = props
  if (!image.aspect_ratios && image.preferredAspectRatio) {
    return generateSrcSet(image.preferredAspectRatio.instances, typeRegex)
  }
  if (!image.aspect_ratios[aspectratio] && !image.preferredAspectRatio)
    return null

  return generateSrcSet(image.aspect_ratios[aspectratio].instances, typeRegex)
}

export const getSrcSet = (props, typeRegex = /jpe?g$/) => {
  if (!props) return null

  let { image, aspectRatio, fallbackSrcSet } = props

  if (!image) return fallbackSrcSet || null

  // if props.aspectRatio is passed in we want that aspect ration so return it first
  // before anything else happens
  if (
    image.aspect_ratios &&
    determineAspectRatio(props) in image.aspect_ratios &&
    image.aspect_ratios[aspectRatio] !== null
  ) {
    return generateSrcSet(
      image.aspect_ratios[determineAspectRatio(props)].instances,
      typeRegex
    )
  }
  if (image.preferredAspectRatio) {
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
  if (!image && fallbackSrc) return { url: fallbackSrc }
  if (!image) return []

  if (image && image.fallback) {
    try {
      return image.preferredAspectRatio.instances.find(
        (inst) => inst.url == image.fallback
      )
    } catch {
      return { url: image.fallback } //here we want to get the width and height of the image fallback
    }
  } else {
    // we can't find anything so try to use the preferred aspect ratio or the first aspect ratio that is present
    let instances
    if (
      image.preferred_aspect_ratio_slug &&
      image.aspect_ratios[image.preferred_aspect_ratio_slug]
    ) {
      instances =
        image.aspect_ratios[image.preferred_aspect_ratio_slug].instances
    } else {
      instances =
        Object.values(image.aspect_ratios).find((value) => value != null)
          ?.instances || []
    }

    // make sure we don't return a webp
    const inst = instances.find((img) =>
      img.url.match(/(jpe?g|gif|png)\??(s=[0-9]+)?$/)
    )
    return inst
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
