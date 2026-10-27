const previewSrc = src => src.replace(/\.(png|jpe?g)$/i, '.preview.webp')

export default function RenderProcess({ process, onOpenImage }) {
  return (
    <>
      <ol className="project-render-stages">
        {process.stages.map((stage, index) => (
          <li key={stage.title}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div><strong>{stage.title}</strong><p>{stage.text}</p></div>
          </li>
        ))}
      </ol>
      <div className="project-render-cases">
        {process.cases.map(item => {
          const images = [item.before, item.after]
          return (
            <article className="project-render-case" key={item.title}>
              <div className="project-render-case-heading">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <div className="project-render-pair">
                {images.map((image, index) => (
                  <figure key={image.src}>
                    <div className="project-render-stage-label">{index === 0 ? '白模输入' : 'AI 效果图'}</div>
                    <button type="button" aria-label={`查看${image.title}原图`} onClick={() => onOpenImage(image, images)}>
                      <img src={previewSrc(image.src)} alt={image.title} loading="lazy" decoding="async" />
                      <span>放大查看</span>
                    </button>
                    <figcaption><strong>{image.title}</strong><span>{image.meta}</span></figcaption>
                  </figure>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
