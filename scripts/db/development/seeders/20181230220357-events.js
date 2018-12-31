const items = [
  {
    uuid: '3346776a-d69d-11e8-9f8b-f2801f1b9fd1',
    community_uuid: '6c52dc16-d6a6-11e8-9f8b-f2801f1b9fd1',
    image_uuid: '6c52dc16-d6a6-11e8-9f8b-f2801f1b9fd1',
    title: '[Aralık] Tanışma Toplantısı',
    content: '<p>Aralık ayında aramıza dahil olanlarla tanışmak, arkaplanları hakkında fikir edinmek ve hedeflerini duymak için bir araya geleceğiz.</p><p><br /></p><p>Her ay aramıza yeni dahil olan grup için bu tarz toplantıları yapmaya devam edeceğiz.</p><p><br /></p><p>Etkinlik herkesin katılımına açıktır. Yeni katılanlar söz önceliğe sahip olacak :)</p><p><br /></p><p>Tarih: 29 Aralık 2018, Cumartesi -- 22:00 <strong>(TR saatiyle)</strong></p><p>Yer: Online konferans (link aşağıda)</p><p><br /></p><p>PC, Mac, Linux, iOS ya da  Android kullanarak bu linkten online konferansa katılabilirsiniz: <a href="http://topluluk.mobilize.io/links?lid=ykFaJRQOj-GqjCojOes3yg&amp;token=ef9tvW5HPWcQte2TeP2vsQ&amp;url=https%3A%2F%2Fzoom.us%2Fj%2F9310912499">https://zoom.us/j/9310912499</a></p><p><br /></p><p>Görüşmek üzere!</p><p>Selman K</p>',
    time_start: new Date(),
    time_end: new Date(),
    time_zone: 'Turkey Standard Time',
    location: 'online',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    uuid: '3346776a-d69d-11e8-9f8b-f2801f1b9fc5',
    community_uuid: '6c52dc16-d6a6-11e8-9f8b-f2801f1b9fd1',
    image_uuid: '6c52dc16-d6a6-11e8-9f8b-f2801f1b9fd6',
    title: '1. Ankara Buluşması',
    // eslint-disable-next-line max-len
    content: '<p>1. Ankara buluşması<strong>16</strong><strong>&nbsp;Temmuz Pazartesi günü&nbsp;</strong>gerçekleştirilecektir.<br><br>Etkinlik ile ilgili güncellemeleri buradan ve Discord üzerinden <strong>(#etkinlik-duyurulari&nbsp;</strong>kanalı)<strong>&nbsp;</strong>takip edebilirsiniz. Herhangi bir soru ve görüşünüz için buraya not düşebilirsiniz ya da <strong>discord</strong> özel mesaj atabilirsiniz.</p><p><br></p><p><strong>Tarih:</strong> 16 Aralık Pazartesi 2018 - 18:00 - 20:00</p><p><strong>Mekan:&nbsp;</strong>Lorem Coffee & Bakery, Adres:&nbsp;</p><p>Tunalı Hilmi Cd., 111. Sk. No:11, Çankaya ANKARA</p><p><a href="#" target="_blank"><strong>Google maps linki icin tiklayin</strong></a></p><p><br></p><p>Görüşmek üzere!</p>',
    time_start: new Date(),
    time_end: new Date(),
    time_zone: 'Turkey Standard Time',
    location: 'address',
    venue_name: 'Lorem Coffee & Bakery',
    address_1: 'Tunalı Hilmi Cd., 111. Sk. No:11',
    address_2: '',
    city: 'Ankara',
    zip: 6230,
    country: 'Turkey',
    latitude: 39.905614,
    longitude: 32.860671,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('events', items, {});
  },
  down: () => {},
};
