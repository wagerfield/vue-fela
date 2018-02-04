export default {
  border: ({ outerRadius, innerRadius, active }) => ({
    borderWidth: outerRadius - innerRadius,
    borderColor: active ? 'green' : 'red',
    borderStyle: 'solid'
  }),
  layout: ({ outerRadius, innerRadius, margin }) => ({
    borderRadius: outerRadius,
    width: innerRadius * 2,
    height: innerRadius * 2,
    margin
  })
}
