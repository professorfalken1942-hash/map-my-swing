# Golf Swing Analyzer – Engineering Rules

## Core Principles

* Build the simplest thing that works
* Avoid premature abstraction
* Optimize for readability over cleverness

## Code Structure

* Keep components under 200 lines
* Prefer functional components
* Avoid deep nesting

## State Management

* Use local state first
* Avoid global state unless necessary
* Do not introduce complex state libraries in MVP

## Performance Rules

* Video processing must not block UI
* Use async processing for pose detection
* Limit frame analysis (e.g., sample every nth frame)

## Reusability

* Only abstract after duplication occurs twice
* Do not build generic systems early

## Dependencies

* Keep dependencies minimal
* Prefer well-supported libraries only

## Error Handling

* Fail gracefully (no crashes)
* Provide fallback UI when processing fails
