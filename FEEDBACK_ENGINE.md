# Golf Swing Analyzer – Feedback Engine

## Approach

Rule-based system (v1). No ML feedback initially.

## Inputs

* Hip rotation angle
* Shoulder rotation angle
* Tempo ratio (backswing : downswing)

## Threshold Examples

### Hip Rotation

* < 30° → insufficient
* 30–45° → acceptable
* > 45° → good

### Shoulder Rotation

* < 60° → insufficient
* 60–90° → good

### Tempo

* Ideal ratio ≈ 3:1
* < 2:1 → too fast
* > 4:1 → too slow

## Output Messages

### Hip

* "Rotate your hips more during backswing"

### Shoulder

* "Turn your shoulders further for power"

### Tempo

* "Slow down your downswing"

## Rules

* Max 2 feedback messages per session
* Prioritize biggest issue first
