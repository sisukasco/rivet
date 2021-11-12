function parents(node:HTMLElement) {
  var nodes = [node]
  
  for (; node; node = <HTMLElement>node.parentNode) {
    nodes.unshift(node)
  }
  return nodes
}

export function commonAncestor(node1:HTMLElement, node2:HTMLElement) {
  var parents1 = parents(node1)
  var parents2 = parents(node2)

  if (parents1[0] != parents2[0])
  {
    return null
  }

  for (var i = 0; i < parents1.length; i++) {
    if (parents1[i] != parents2[i]) return parents1[i - 1]
  }
  return null
}