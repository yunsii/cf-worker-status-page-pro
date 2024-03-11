export class Subrequests {
  total = 0
  notifiedCount = 0
  requiredCount = 0

  required() {
    this.requiredCount += 1
    this.total += 1
  }

  checked() {
    this.total += 1
  }

  notified() {
    this.notifiedCount += 1
    this.total += 1
  }
}
