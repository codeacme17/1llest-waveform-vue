function timeCounter(targetTime: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, targetTime))
}

export default timeCounter
