# Golf Swing Analyzer – Tasks

## Phase 1 – Core Capture ✅ DONE

* [x] Build camera screen
* [x] Implement record / stop
* [x] Save video locally

## Phase 2 – Playback ✅ DONE

* [x] Build video player
* [x] Add scrubbing
* [x] Add slow motion

## Phase 3 – Pose Detection ✅ DONE

* [x] Integrate MediaPipe
* [x] Extract joint positions
* [x] Render PoseOverlay (gold skeleton, real-time)

## Phase 4 – Metrics ✅ DONE

* [x] Calculate hip rotation
* [x] Calculate shoulder rotation
* [x] Calculate tempo (placeholder — needs timing analysis)

## Phase 5 – Feedback ✅ DONE

* [x] Implement rule engine
* [x] Map metrics to messages
* [x] Display FeedbackCard

## Phase 6 – History & Progress (IN PROGRESS)

* [x] Auto-save swing sessions to localStorage
* [x] History page with session list
* [x] Progress charts (hip, shoulder, tempo over time)
* [x] Trend indicators (improving / consistent / needs work)
* [ ] Session comparison (side-by-side two swings)
* [ ] Export/share session data

## Phase 7 – UI Polish

* [ ] Apply UX rules across all screens
* [ ] Improve camera screen (full screen, flip camera option)
* [ ] Improve playback screen layout (mobile-first)
* [ ] Loading states for MediaPipe initialization
* [ ] Onboarding tips ("Stand 6 feet from camera, full body in frame")

## Phase 8 – MVP Release

* [ ] Test with real users
* [ ] Fix major issues
* [ ] Deploy to production

## Backlog (Future)

* [ ] Flip camera (front/back toggle on mobile)
* [ ] Video upload from camera roll (not just live recording)
* [ ] Tempo calculation from actual swing phase timing (backswing vs downswing duration)
* [ ] Side-by-side swing comparison
* [ ] Pro swing reference library (compare to ideal swing)
* [ ] Share swing via unique URL
* [ ] Coach feedback system (annotate video)
* [ ] User accounts + cloud sync (Firebase)
* [ ] Push notifications for weekly progress summary
* [ ] Apple HealthKit / wearable integration
* [ ] Handicap correlation (link swing metrics to score)
