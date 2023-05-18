let dict, frame_names = {};

function strip_frame_indices(frame) {
  return frame ? frame.replaceAll(/([ce12])[ijx]+/g, '$1') : frame;
}

function render_entry(entry) {
  let attributes = [];
  function attr(k, v) {
    attributes.push(`<li><span class="attribute">${k}</span> ` +
                        `<span class="value">${v}</span></li>`);
  }
  let frame = strip_frame_indices(entry.frame);
  if(frame) {
    let frame_name = frame_names[frame];
    attr('frame', frame_name ? `${frame_name} (${frame})` : frame);
  }
  let english = entry.english;
  if(entry.distribution) {
    english = english.split('; ');
    let e = entry.distribution.split('; ').pop().split(' ');
    let last_english = english.pop().split('▯')
      .map((part, i) => {
        if(i == e.length) return part;
        return part + `▯<sub class="distribution">${
          (e[i] || "").toUpperCase()}</sub>`;
      }).join('');
    english.push(last_english);
    english = english.join('; ');
  }
  if(entry.gloss) gl = ` <span class="gloss">‘${entry.gloss}’</span>`;
  if(entry.fields && entry.fields.length)
    entry.fields = entry.fields.map((_, i) =>
      '<span class="toaq">' +
      (_ instanceof Array ? _ : [_]).map((s, i) => s.replace(/[auıoe]/,
        m => ((m == 'ı' ? 'i' : m) + '\u0309').normalize('NFC'))).join(' ra ')
      + ' baq jả' + ['shı', 'gu', 'saq', 'jo', 'fe', 'cı'][i] + '</span>');
  for(f of ['notes', 'fields'])
    if(entry[f] && entry[f].length)
      attr(f, `<ul class="notes"><li>` +
                `${entry[f].join('</li> <li>')}</li></ul>`);
  if(entry.keywords && entry.keywords.length)
    attr('keywords', entry.keywords.join('; '));
  if(entry.examples && entry.examples.length) {
    const maples = entry.examples.map(({toaq, english}) =>
      `<li><span class="toaq">${toaq}</span> ` +
          `<span class="english">${english}</span></li>`);
    attr('examples', `<ul class="examples">${maples.join(' ')}</ul>`);
  }
  return `<div class="entry">` +
           `<div class="header">` +
             `<span class="toaq">${entry.toaq}</span> ` +
             `<span class="type">${entry.type}</span>` +
             `${gl || ''}` +
           `</div> ` +
           `<div class="content">${english}</div> ` +
           `<ul class="footer">${attributes.join(' ')}</ul>` +
         `</div>`;
}

function frames() {
  for (const entry of dict) {
    if (entry.namesake) {
      const frame = strip_frame_indices(entry.frame);
      const name = entry.toaq.toUpperCase();
      if (frame_names[frame]) {
        throw new Error(`frame ‘${frame}’ has two conflicting names: «${frame_names[frame]}» and «${name}»`);
      }
      frame_names[frame] = name;
    }
  }
}

function fail(s) {
  document.getElementById('loading').innerText =
    'An error occurred: ' + s;
}

function download() {
  let xhttp = new XMLHttpRequest;
  xhttp.open('GET', 'dictionary.json', true);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4) {
      if(xhttp.status != 200)
        fail('could not retrieve file');
      else try {
        dict = JSON.parse(xhttp.responseText);
        display();
      } catch(e) {
        fail(e.toString());
      }
    }
  }
}

function display() {
  let loading = document.getElementById('loading'),
    generated = document.getElementById('generated');
  frames();
  generated.innerHTML = generated.innerHTML
    .replace(/\ *%%%/, _ =>
      dict.map(render_entry)
        .join('\n')
        .replace(/▯/g, '___'));
  generated.style.display = 'block';
  loading.style.display = 'none';
}

download();
