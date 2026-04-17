# Golf Swing Analyzer – Data Model

## SwingSession

* id
* videoUrl
* createdAt
* metrics
* feedback

## Metrics

* hipRotation
* shoulderRotation
* backswingTime
* downswingTime
* tempoRatio

## FrameData (optional v2)

* timestamp
* jointCoordinates

## Feedback

* type (hip / shoulder / tempo)
* message
* severity (low, medium, high)
