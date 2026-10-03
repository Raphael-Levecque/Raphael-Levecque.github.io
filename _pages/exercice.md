---
layout: single
title: "un petit exercice"
permalink: /exercice/
---

petit exercice python qui débloque quelque chose si t'y arrives (j'espère!)

**l'exercice :** écris une fonction `reverse_string(some_str)` qui reçoit une chaîne de caractère et renvoie la chaîne inversée, par exemple : 
```python
>>> print(reverse_string("lilliad"))
>>> "diallil"
```

<div id ="hints">
  <button type="button" data-toggle="hint-one">un indice stpp</button>
  <div id="hint-one" markdown="1" hidden>


  - on peut créer une chaîne vide : `res = ""`
  - on peut ajouter un caractère à la fin d'une chaîne : `res += c`
  - on peut connaître la longueur d'une chaîne `len("world")` renvoie 5
  - on peut accéder à n'importe quel caractère d'une chaîne avec l'opérateur `[]`
  `"hello"[0]` renvoie `h` et `"hello"[4]` renvoie `o`(l'indexation commence à 0 et fini à la longueur de la chaîne - 1)

  </div>

  <button type="button" data-toggle="hint-two">un autre</button>
  <div id="hint-two" markdown="1" hidden>

  - on peut parcourir des indices grâce à une boucle for et range

  ```python
  for i in range(3):
      print(i)   # 0, 1, 2
  ```

  - range fonctionne aussi avec range(start,end,step), en sachant que la boucle s'arrête à end-step

  ```python
  for i in range(10, 0, -2):
      print(i)   # 10, 8, 6, 4, 2
  ```

  </div>

  <button type="button" data-toggle="soluce">ça m'emmerde ton truc donne la réponse là</button>
  <div id="soluce" markdown="1" hidden>

  ```python
  def reverse_string(texte):
    res = ""
    for i in range(len(texte) - 1, -1, -1):
      res += texte[i]
    return res
  ```

  ou en une ligne :

  ```python
  def reverse_string(texte):
    return texte[::-1]
  ```

  </div>
</div>

<div id="exo">
  <textarea id="exo-code" spellcheck="false" rows="10" style="width:100%; font-family:monospace; font-size:0.9em; tab-size:4;">def reverse_string(some_str):
    # écris ton code ici
    return ""
</textarea>

  <p>
    <button id="exo-run" type="button">on va voir si t'as bon</button>
    <span id="exo-status" style="margin-left:10px;"></span>
  </p>

  <ul id="exo-results" style="list-style:none; padding-left:0; font-family:monospace;"></ul>

  <div id="exo-reveal" style="text-align:center;"></div>
</div>

<script src="{{ '/js/exercice.js' | relative_url }}"></script>
